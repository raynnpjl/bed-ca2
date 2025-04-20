const express = require('express');
const petController = require('../controllers/petController.js');

const router = express.Router();

router.get('/', petController.getAllPet);


module.exports = router;