const db = require("../config/db");

module.exports = {
    async auctionItem(user_id, username, item, price) {
        const [result] = await db.query('INSERT INTO market (user_id, username, item, price) VALUES (?, ?, ?, ?)', [user_id, username, item, price])
        return result.insertId
    },

    async listMarket() {
        const [result] = await db.query('SELECT * FROM market')
        return result
    },

    async getAuctionById(auction_item_id) {
        const [result] = await db.query('SELECT * FROM market WHERE auction_item_id = ?', [auction_item_id])
        return result
    },

    async deleteAuction(auction_item_id) {
        await db.query('DELETE FROM market WHERE auction_item_id = ?', [auction_item_id]);
    },

    async recordTransaction(auction_item_id, buyer_user_id, seller_user_id, transacted_item, price) {
        await db.query('INSERT INTO transactioncompletion (auction_item_id, buyer_user_id, seller_user_id, transacted_item, price, transaction_date) VALUES (?, ?, ?, ?, ?, now())', [auction_item_id, buyer_user_id, seller_user_id, transacted_item, price])
    }
}