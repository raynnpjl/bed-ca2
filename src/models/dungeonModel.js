const db = require("../config/db");

module.exports = {
    async getAllDungeon() {
        const [result] = await db.query('SELECT * FROM dungeon')
        return result
    },

    async getAllDungeonDropsInfo() {
        const [result] = await db.query('SELECT * FROM gear')
        return result
    },

    async getDungeonWithDungeonId(dungeon_id) {
        const [result] = await db.query('SELECT * FROM dungeon WHERE dungeon_id = ?', [dungeon_id])
        return result
    },

    async completeDungeon(dungeon_id, character_id) {
        const [result] = await db.query('INSERT INTO dungeoncompletion (dungeon_id, character_id, creation_date) VALUES (?, ?, now())',[dungeon_id, character_id])
        return result
    }
}