const marketModel = require('../models/marketModel');
const userModel = require('../models/userModel');
const inventoryModel = require("../models/inventoryModel");
const responseView = require('../views/responseView');

module.exports = {
    /* Handles the auctioning of an item by a user
    Formats the item's name, retrieves user information, and adds the auction to the market */
    async auctionItem(req, res) {
        try {
            const user_id = req.body.user_id

            const user = await userModel.getUserById(user_id)
            const username = user[0].username

            const item = req.body.item.toLowerCase()

            var itemUpd = item.split(" ");

            for (let i = 0; i < itemUpd.length; i++) {
                itemUpd[i] = itemUpd[i][0].toUpperCase() + itemUpd[i].substr(1);
            }

            itemUpd = itemUpd.join(" ");
            const price = req.body.price

            const auctionId = await marketModel.auctionItem(user_id, username, itemUpd, price)

            responseView.confirmCreated(res, { auctionId: auctionId, user_id, username, item: itemUpd, price })
        } catch (err) {
            responseView.sendError(res, 'Unable to auction item in market', err)
        }
    },

    /* Middleware to check if a user has a specific item in their inventory
    Sends an error response if the item is not found */
    async checkUserInventoryForItem(req, res, next) {
        try {
            const user_id = req.body.user_id
            const item = req.body.item.toLowerCase()

            var itemUpd = item.split(" ");

            for (let i = 0; i < itemUpd.length; i++) {
                itemUpd[i] = itemUpd[i][0].toUpperCase() + itemUpd[i].substr(1);
            }

            itemUpd = itemUpd.join(" ");

            const inventory = await inventoryModel.getInventoryWithUserId(user_id)
            const items = inventory[0].items

            const index = items.indexOf(itemUpd)
            if (index < 0) {
                responseView.NotFound(res, 'User does not have the item')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Fail to check user inventory for item', err)
        }
    },

    /* Middleware to remove an item from a user's inventory after it is auctioned */
    async removeItemFromInventory(req, res, next) {
        try {
            const user_id = req.body.user_id
            const item = req.body.item.toLowerCase()

            var itemUpd = item.split(" ");

            for (let i = 0; i < itemUpd.length; i++) {
                itemUpd[i] = itemUpd[i][0].toUpperCase() + itemUpd[i].substr(1);
            }

            itemUpd = itemUpd.join(" ");
            
            const inventoryList = await inventoryModel.getInventoryList()
            var selectedInventory
    
            for (var i=0;i<inventoryList.length;i++) {
                if (inventoryList[i].user_id == user_id) {
                    selectedInventory = inventoryList[i]
                }
            }
    
            var currentInventory = selectedInventory.items
    
            const indexOfItem = currentInventory.indexOf(itemUpd)
    
            if (indexOfItem > -1) {
                currentInventory.splice(indexOfItem, 1)
            }
    
            currentInventory = JSON.stringify(currentInventory)
    
            await inventoryModel.updateInventoryItems(user_id, currentInventory)

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to remove item from inventory', err)
        }
    },

    /* Middleware to check for basic auction parameters (user_id, item, price) */
    async simpleCheckForAuctionItem(req, res, next) {
        try {
            if (req.body.user_id == undefined || req.body.item == undefined || req.body.price == undefined) {
                responseView.BadRequest(res, 'user_id, item or price is missing')
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to do simple check before auctioning item', err)
        }
    },

    /* Middleware to check if a user exists in the database */
    async checkUserExistence(req, res, next) {
        try {
            const user_id = req.body.user_id

            const user = await userModel.getUserById(user_id)

            if (user.length === 0) {
                responseView.NotFound(res, 'User does not exist')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to check whether user exist', err)
            console.log(err)
        }
    },

    /* Middleware to check if a user has an inventory */
    async checkInventoryExistence(req, res, next) {
        try {
            const user_id = req.body.user_id

            const inventoryList = await inventoryModel.getInventoryList()

            var inventoryNonExistence = true

            for (var i=0;i<inventoryList.length;i++) {
                if (inventoryList[i].user_id == user_id) {
                    inventoryNonExistence = false
                }
            }

            if(inventoryNonExistence) {
                responseView.NotFound(res, 'Inventory does not exist, user likely have not created a dungeon yet')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to check whether user have a inventory', err)
        }
    },

    /* Fetches and returns the list of items currently in the market */
    async listMarket(req, res) {
        try {
            const marketList = await marketModel.listMarket()
            responseView.sendSuccess(res, marketList)
        } catch (err) {
            responseView.sendError(res, 'Unable to access market', err)
        }
    },

    /* Handles the process of buying an item from the auction */
    async buyAuctionItem(req, res) {
        try {
            const auction_item_id = parseInt(req.params.auction_item_id)
            const user_id = req.body.user_id
            
            const buyerInventory = await inventoryModel.getInventoryWithUserId(user_id)
            const currentBuyerGold = buyerInventory[0].gold

            const selectedAuction = await marketModel.getAuctionById(auction_item_id)
            const auction_item_cost = selectedAuction[0].price

            const updatedBuyerGold = currentBuyerGold - auction_item_cost

            const seller_user_id = selectedAuction[0].user_id
            const sellerInventory = await inventoryModel.getInventoryWithUserId(seller_user_id)
            const currentSellerGold = sellerInventory[0].gold

            const updatedSellerGold = currentSellerGold + auction_item_cost

            await inventoryModel.updateInventoryGold(user_id, updatedBuyerGold)
            await inventoryModel.updateInventoryGold(seller_user_id, updatedSellerGold)

            const auctionedItem = selectedAuction[0].item

            var currentBuyerItem = buyerInventory[0].items

            currentBuyerItem.push(auctionedItem)
            
            currentBuyerItem = JSON.stringify(currentBuyerItem)

            await inventoryModel.updateInventoryItems(user_id, currentBuyerItem)

            await marketModel.deleteAuction(auction_item_id)

            await marketModel.recordTransaction(auction_item_id, user_id, seller_user_id, auctionedItem, auction_item_cost)

            responseView.sendSuccess(res, `Successfully bought ${selectedAuction[0].item}`)
        } catch (err) {
            responseView.sendError(res, 'Fail to purchase item', err)
        }
    },

    /* Middleware to check if a user has enough gold to purchase an auction item */
    async checkUserGold(req, res, next) {
        try {
            const auction_item_id = req.params.auction_item_id
            const user_id = req.body.user_id
    
            const buyerInventory = await inventoryModel.getInventoryWithUserId(user_id)
            const currentBuyerGold = buyerInventory[0].gold

            const selectedAuction = await marketModel.getAuctionById(auction_item_id)
            const auction_item_cost = selectedAuction[0].price

            if (currentBuyerGold < auction_item_cost) {
                responseView.Forbidden(res, 'Not enough gold to purchase')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check user gold', err)
        }
    },

    /* Middleware to check if an auction exists with the given auction item ID */
    async checkAuctionExistence(req, res, next) {
        try {
            const auction_item_id = req.params.auction_item_id

            const selectedAuction = await marketModel.getAuctionById(auction_item_id)

            if(selectedAuction.length === 0) {
                responseView.NotFound(res, 'Auction does not exist')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Fail to check whether auction exist', err)
        }
    },

    /* Middleware to do simple check on purchasing of auction item input */
    async simpleCheckForAuctionPurchase(req, res, next) {
        try {
            if (req.body.user_id == undefined) {
                responseView.BadRequest(res, `Missing buyer's user_id`)
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Fail to do simple check before purchasing')
        }
    },

    /* Handles the deletion of an auction, returning the item to the user's inventory */
    async deleteAuction(req, res) {
        try {
            const auction_item_id = req.params.auction_item_id
            const selectedAuction = await marketModel.getAuctionById(auction_item_id)
            const user_id = req.body.user_id
            const selectedInventory = await inventoryModel.getInventoryWithUserId(user_id)
            var inventoryItem = selectedInventory[0].items
            inventoryItem.push(selectedAuction[0].item)

            inventoryItem = JSON.stringify(inventoryItem)

            await inventoryModel.updateInventoryItems(user_id, inventoryItem)

            await marketModel.deleteAuction(auction_item_id)

            responseView.noContent(res, `Successfully retrieve ${selectedAuction[0].item}`)
        } catch (err) {
            responseView.sendError(res, 'Unable to retrieve item and delete auction', err)
        }
    },

    /* Middleware to check if a user owns an auction */ 
    async checkOwnership(req, res, next) {
        try {
            const auction_item_id = req.params.auction_item_id
            const selectedAuction = await marketModel.getAuctionById(auction_item_id)
            const auction_owner_id = selectedAuction[0].user_id
            const user_id = req.body.user_id

            if (auction_owner_id != user_id) {
                responseView.Forbidden(res, 'You did not auctioned this item')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to check ownership of auction', err)
        }
    },

    /* Middleware to do simple check on item deletion input */
    async simpleCheckForDeleteAuction(req, res, next) {
        try {
            if (req.body.user_id == undefined) {
                responseView.BadRequest(res, "Missing user_id")
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, "Failed to do simple check for delete auction", err)
        }
    }
}