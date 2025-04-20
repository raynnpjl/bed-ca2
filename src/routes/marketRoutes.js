const express = require('express');
const marketController = require('../controllers/marketController.js');

const router = express.Router();

router.post('/', marketController.simpleCheckForAuctionItem, marketController.checkUserExistence, marketController.checkInventoryExistence, marketController.checkUserInventoryForItem, marketController.removeItemFromInventory, marketController.auctionItem);
router.get('/', marketController.listMarket);
router.post('/:auction_item_id', marketController.simpleCheckForAuctionPurchase, marketController.checkUserExistence, marketController.checkInventoryExistence, marketController.checkAuctionExistence, marketController.checkUserGold, marketController.buyAuctionItem);
router.delete('/:auction_item_id', marketController.simpleCheckForDeleteAuction, marketController.checkAuctionExistence, marketController.checkUserExistence, marketController.checkOwnership, marketController.deleteAuction);

module.exports = router;