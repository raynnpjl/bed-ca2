const db = require("../config/db");

module.exports = {
    async getClassInfo(class_name) {
        const [result] = await db.query('SELECT * FROM class WHERE class = ?', [class_name])
        return result
    },

    async getClassList() {
        const [result] = await db.query('SELECT * FROM class')
        return result
    }
}