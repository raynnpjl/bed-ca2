const db = require("../config/db");

module.exports = {
    async createFaction(faction_name, faction_desc, character_id, min_lvl, owner_name, members) {
        const [result] = await db.query(`INSERT INTO faction (faction_name, faction_desc, min_lvl, owner_character_id, owner_name, members) VALUES (?, ?, ?, ?, ?, ?)`, [faction_name, faction_desc, min_lvl, character_id, owner_name, members])
        return result.insertId
    },

    async getFactionWithId(faction_id) {
        const [result] = await db.query(`SELECT faction_id, faction_name, faction_desc, min_lvl, owner_name, members FROM faction WHERE faction_id = ?`, [faction_id])
        return result
    },

    async getFactionList() {
        const [result] = await db.query(`SELECT faction_id, faction_name, faction_desc, min_lvl, owner_name, members FROM faction`)
        return result
    },

    async getAllFactionInfoWithId(faction_id) {
        const [result] = await db.query(`SELECT * FROM faction WHERE faction_id = ?`, [faction_id])
        return result
    },

    async updateFactionMembers(faction_id, members) {
        await db.query(`UPDATE faction SET members = ? WHERE faction_id = ?`, [members, faction_id])
    },

    async updateFaction(faction_id, faction_name, faction_desc, min_lvl) {
        await db.query(`UPDATE faction SET faction_name = ?, faction_desc = ?, min_lvl = ? WHERE faction_id = ?`, [faction_name, faction_desc, min_lvl, faction_id])
    },

    async deleteFaction(faction_id) {
        await db.query(`DELETE FROM faction WHERE faction_id = ?`, [faction_id])
    }
}