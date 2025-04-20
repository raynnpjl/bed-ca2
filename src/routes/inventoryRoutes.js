const express = require('express');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.get('/:user_id', inventoryController.checkUserExistence, inventoryController.checkInventoryExistence, inventoryController.getInventoryWithUserId);

module.exports = router;