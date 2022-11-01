const express = require('express')
const userController = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.post('/signup', userController.signup);

userRouter.post('/login', userController.login);

userRouter.post('/logout', userController.logout); // Secured

module.exports = userRouter;