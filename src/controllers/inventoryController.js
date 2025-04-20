const inventoryModel = require('../models/inventoryModel');
const userModel = require('../models/userModel');
const responseView = require('../views/responseView');

module.exports = {
    /* Fetches the inventory associated with a given user ID
    Sends the inventory data if found, otherwise handles errors */
    async getInventoryWithUserId(req, res) {
        try {
            const user_id = req.params.user_id
            const inventory = await inventoryModel.getInventoryWithUserId(user_id);
            responseView.sendSuccess(res, inventory);
        } catch (err) {
            responseView.sendError(res, 'Failed to fetch inventory', err)
        }
    },

    /* Middleware to check if a user exists based on the provided user ID
    Proceeds to the next middleware or handler if the user exists; otherwise, sends a "not found" response */
    async checkUserExistence(req, res, next) {
        try {
            const user_id = req.params.user_id

            const user = await userModel.getUserById(user_id)

            if (user.length === 0) {
                responseView.NotFound(res, 'User does not exist')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to check whether user exist', err)
        }
    },

    /* Middleware to check if a user has an inventory
    Proceeds to the next middleware or handler if the inventory exists; otherwise, sends a "not found" response */
    async checkInventoryExistence(req, res, next) {
        try {
            const user_id = req.params.user_id

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
    }
}