const db = require("../config/db");

module.exports = {
    async getAllChallenges() {
        const [rows] = await db.query('SELECT * FROM fitnesschallenge');
        return rows;
    },

    async createChallenge(challenge_name, challenge, creator_id, skillpoints) {
        const [result] = await db.query('INSERT INTO fitnesschallenge (challenge_name, challenge, creator_id, skillpoints) VALUES (?, ?, ?, ?)', [challenge_name, challenge, creator_id, skillpoints]);
        return result.insertId;
      },
      
      async updateChallenge(challenge_id, challenge_name, challenge, creator_id, skillpoints) {
        await db.query('UPDATE fitnesschallenge SET challenge_name = ?, challenge = ?, creator_id = ?, skillpoints = ? WHERE challenge_id = ?', [challenge_name, challenge, creator_id, skillpoints, challenge_id]);
      },

      async deleteChallenge(challenge_id) {
        await db.query('DELETE FROM fitnesschallenge WHERE challenge_id = ?', [challenge_id]);
      },

      async completeChallenge(challenge_id, user_id, challenge_name, challenge, completed, notes) {
        const [result] = await db.query('INSERT INTO usercompletion (challenge_id, user_id, challenge_name, challenge, completed, notes) VALUES (?, ?, ?, ?, ?, ?)', [challenge_id, user_id, challenge_name, challenge, completed, notes]);
        return result.insertId;
      },

      async getChallengeById(challenge_id) {
        const [result] = await db.query('SELECT * FROM usercompletion WHERE user_id = ?', [challenge_id]);
        return result
      },

      async getChallengeByChallengeId(challenge_id) {
        const [result] = await db.query('SELECT * FROM fitnesschallenge WHERE challenge_id = ?', [challenge_id]);
        return result
      },

      async addNoteToCompleted(complete_id, notes) {
        await db.query('UPDATE usercompletion SET notes = ? WHERE complete_id = ?', [notes, complete_id])
      }
};

