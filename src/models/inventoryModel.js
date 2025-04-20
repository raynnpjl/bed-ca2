const db = require("../config/db");

module.exports = {
    async getInventoryList() {
        const [result] = await db.query('SELECT * FROM inventory')
        return result
    },

    async createInventory(user_id) {
        await db.query(`INSERT INTO inventory (user_id, items, gold) VALUES (?, '[]', 0)`, [user_id]);
    },

    async getInventoryWithUserId(user_id) {
        const [result] = await db.query('SELECT * FROM inventory WHERE user_id = ?', [user_id])
        return result
    },

    async updateInventoryItems(user_id, items) {
        await db.query(`UPDATE inventory SET items = ? WHERE user_id = ?`, [items, user_id])
    },

    async updateInventoryGold(user_id, gold) {
        await db.query(`UPDATE inventory SET gold = ? WHERE user_id = ?`, [gold, user_id])
    }
}