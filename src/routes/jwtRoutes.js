const express = require('express');
const exampleController = require('../controllers/exampleController')
const jwtMiddleware = require('../middleware/jwtMiddleware')

const router = express.Router()

router.post("/generate", exampleController.preTokenGenerate, jwtMiddleware.generateToken, exampleController.beforeSendToken, jwtMiddleware.sendToken);
router.get("/verify", jwtMiddleware.verifyToken, exampleController.showTokenVerified);

module.exports = router