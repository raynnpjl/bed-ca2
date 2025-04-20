const db = require("../config/db");

module.exports = {
    async getGearByName(item) {
        const [result] = await db.query('SELECT * FROM gear WHERE item = ?', [item])
        return result
    }
}