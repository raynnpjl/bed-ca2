const db = require("../config/db");

module.exports = {
    async getPetList() {
        const [result] = await db.query('SELECT * FROM pet')
        return result
    }
}