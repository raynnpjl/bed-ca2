const db = require("../config/db");

module.exports = {
    async createCharacter(user_id, character_name, character_class, faction, lvl, weapon, helmet, chestplate, leggings, hp, atk, atk_spd, movement_spd, energy, mana, passive, skill1, skill2, pet_name, pet_lvl) {
        const [result] = await db.query(`INSERT INTO characters (user_id, character_name, character_class, faction, lvl, weapon, helmet, chestplate, leggings, hp, atk, atk_spd, movement_spd, energy, mana, passive, skill1, skill2, pet_name, pet_lvl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, character_name, character_class, faction, lvl, weapon, helmet, chestplate, leggings, hp, atk, atk_spd, movement_spd, energy, mana, passive, skill1, skill2, pet_name, pet_lvl]);
        return result.insertId
    },

    async getCharacterWithUserId(user_id) {
        const [result] = await db.query('SELECT * FROM characters where user_id = ?', [user_id])
        return result
    },

    async getCharacterList() {
        const [result] = await db.query('SELECT character_id, user_id, character_name, character_class, lvl, weapon, helmet, chestplate, leggings FROM characters')
        return result
    },

    async getAllClasses() {
        const [result] = await db.query('SELECT * FROM class');
        return result
    },

    async getCharacterWithUserIdWithStat(user_id) {
        const [result] = await db.query('SELECT character_id, character_name, character_class, hp, atk, atk_spd, movement_spd, energy, mana FROM characters WHERE user_id = ?',[user_id]);
        return result
    },

    async getCharacterWithUserIdWithAbility(user_id) {
        const [result] = await db.query('SELECT character_id, character_name, character_class, passive, skill1, skill2 FROM characters WHERE user_id = ?',[user_id]);
        return result
    },

    async levelUpCharacter(user_id, character_name, updated_lvl) {
        const [result] = await db.query('UPDATE characters SET lvl = ? WHERE character_name = ? and user_id = ?', [updated_lvl, character_name, user_id]);
        return result
    },

    async getCharacterWithCharacterId(character_id) {
        const [result] = await db.query('SELECT * FROM characters where character_id = ?', [character_id])
        return result
    },

    async petLvlUp(character_id, updatedPetLvl) {
        await db.query('UPDATE characters SET pet_lvl = ? WHERE character_id = ?', [updatedPetLvl, character_id])
    },

    async getCharacterWithUserIdAndName(user_id, character_name) {
        const [result] = await db.query('SELECT * FROM characters WHERE user_id = ? AND character_name = ?', [user_id, character_name])
        return result
    },

    async equipEquipment(character_id, part, item) {
        await db.query(`UPDATE characters SET ${part} = ? WHERE character_id = ?`, [item, character_id])
    },

    async updateStat(character_id, stat, value) {
        await db.query(`UPDATE characters SET ${stat} = ? WHERE character_id = ?`, [value, character_id])
    },

    async updateCharacterFaction(character_id, faction) {
        await db.query('UPDATE characters SET faction = ? WHERE character_id = ?', [faction, character_id])
    },

    async unequipEquipment(character_id, part) {
        await db.query(`UPDATE characters SET ${part} = '' WHERE character_id = ?`, [character_id])
    },

    async updatePet(character_id, newPet) {
        await db.query(`UPDATE characters SET pet_name = ? WHERE character_id = ?`, [newPet, character_id])
    },

    async deleteCharacterWithCharacterNameAndUserId(user_id, character_name) {
        await db.query(`DELETE FROM characters WHERE user_id = ? AND character_name = ?`, [user_id, character_name])
    },

    async getCharacterWithCharacterName(character_name) {
        const [result] = await db.query(`SELECT * FROM characters WHERE character_name = ?`, [character_name])
        return result
    },
    
    async getCharacterBaseStat(user_id) {
        const [result] = await db.query(`SELECT a.character_id, a.user_id, a.character_name, a.character_class, a.faction, a.lvl, b.hp, b.atk, b.atk_spd, b.movement_spd, b.energy, b.mana FROM characters a JOIN class b ON a.character_class = b.class WHERE a.user_id = ?`, [user_id])
        return result
    },

    async characterRanking() {
        const [result] = await db.query(`SELECT RANK () OVER (ORDER BY lvl desc) AS rank_no, character_id, user_id, character_name, character_class, faction, lvl FROM characters`)
        return result
    }
}