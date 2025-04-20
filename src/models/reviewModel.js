const db = require("../config/db");

module.exports = {
    async selectAll() {
        const [result] = await db.query('SELECT * FROM reviews')
        return result
    },

    async selectById(id) {
        const [result] = await db.query('SELECT * FROM reviews WHERE id = ?', [id])
        return result
    },

    async insertSingle(user_id, username, review_amt, review_msg) {
        const [result] = await db.query('INSERT INTO reviews (user_id, username, review_amt, review_msg) VALUES (?, ?, ?, ?)', [user_id, username, review_amt, review_msg]);
        return result.insertId
    },

    async updateById(id, user_id, username, review_amt, review_msg) {
        await db.query('UPDATE reviews SET user_id = ?, username = ?, review_amt = ?, review_msg = ? WHERE id = ?', [user_id, username, review_amt, review_msg, id])
    } ,

    async deleteById(id) {
        await db.query('DELETE FROM reviews WHERE id = ?', [id])
    },

    async selectByUserId(user_id) {
        const [result] = await db.query('SELECT * FROM reviews WHERE user_id = ?', [user_id]);
        return result
    }
}