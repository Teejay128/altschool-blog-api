const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
require('dotenv').config();

const maxAge = 60 * 60;
/**
 * 
 * @param {string} id 
 * @returns JWT token
 * 
 * Function to create a jwt token
 */
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * Middleware to authenticfate user
 * 
 * Checks for token in jwt cookie
 * 
 * If err or no token, redirect to login page
 * 
 * calls next() if token is verified
 */
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token){
        console.log("No token")
        return res.json({
            status: "failed",
            message: "You need to be logged in to continue this action"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if(err){
            console.log(err.message)
            return res.redirect('/api/v1/login');
        } else {
            next();
        }
    })
    
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns id of user
 * 
 * Function to check the current user
 * 
 * returns user id if user is found and token ids valid
 */
const checkUser = async (req, res) => {
    const token = req.cookies.jwt;
    
    if(!token){
        console.log('No token, please login');
        return null
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decodedToken.id)
    return user
}


module.exports = {
    createToken,
    requireAuth,
    checkUser
};