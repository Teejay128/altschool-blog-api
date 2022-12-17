const express = require('express')
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/jwt')

const userRouter = express.Router();

userRouter.post('/signup', userController.signup);

userRouter.post('/login', userController.login);

userRouter.post('/logout', requireAuth, userController.logout); // Secured

module.exports = userRouter;