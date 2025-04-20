const express = require('express');
const exampleController = require('../controllers/exampleController')
const bcryptMiddleware = require('../middleware/bcryptMiddleware')

const router = express.Router()

router.post("/compare", exampleController.preCompare, bcryptMiddleware.comparePassword, exampleController.showCompareSuccess);
router.post("/hash", bcryptMiddleware.hashPassword, exampleController.showHashing);

module.exports = router