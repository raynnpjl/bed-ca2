const db = require("../config/db");

module.exports = {
    async getAllUsers() {
        const [result] = await db.query('SELECT * FROM user');
        return result;
    },

    async createUser(username, email, password,  skillpoints) {
        const [result] = await db.query('INSERT INTO user (username, email, password, skillpoints) VALUES (?, ?, ?, ?)', [username, email, password, skillpoints]);
        return result.insertId;
      },
      
    async getUserById(id) {
      const [result] = await db.query('SELECT * FROM user WHERE user_id = ?', [id]);
      return result;
    },
      
    async updateUser(id, username, skillpoints) {
      await db.query('UPDATE user SET username = ?, skillpoints = ? WHERE user_id = ?', [username, skillpoints, id]);
    },

    async deleteUser(id) {
      await db.query('DELETE FROM user WHERE user_id = ?', [id]);
    },

    async getUserByUsername(username) {
      const [result] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
      return result
    },

    async updateUserInfo(user_id, username, email) {
      await db.query('UPDATE user SET username = ?, email = ? WHERE user_id = ?', [username, email, user_id]);
    },

    async getUserByEmail(email) {
      const [result] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
      return result
    },

    async changePassword(user_id, password) {
      await db.query('UPDATE user SET password = ? WHERE user_id = ?', [password, user_id])
    }
};

