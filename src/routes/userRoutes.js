const express = require('express');
const userController = require('../controllers/userController');
const bcryptMiddleware = require('../middleware/bcryptMiddleware');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();

router.get('/', userController.listUsers);
router.post('/', bcryptMiddleware.hashPassword, userController.createUser, jwtMiddleware.generateToken, jwtMiddleware.sendToken); //Register
router.post('/login', userController.loginUser, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken) //Login
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/getuser/:username', userController.getUserByName);
router.put('/edit/:user_id', userController.editUserInfo);
router.put('/password/:user_id', bcryptMiddleware.hashPassword, userController.changePassword);

module.exports = router;