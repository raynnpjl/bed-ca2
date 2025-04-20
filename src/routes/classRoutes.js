const express = require('express');
const classController = require('../controllers/classController');

const router = express.Router();

router.get('/', classController.getClassList);

module.exports = router;