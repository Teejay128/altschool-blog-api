const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
require('dotenv').config();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token){
        console.log('No token');
        res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if(err){
            console.log(err.message)
            res.redirect('/login');
        } else {
            console.log(decodedToken);
            next();
        }
    })
    
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token){
        console.log('No token');
        // res.locals.user = null;
        next();
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if(err){
            console.log(err.message);
            // res.locals.user = null
            next();
        } else {
            console.log(decodedToken);
            let user = await User.findById(decodedToken.id)
            console.log(`${user.first_name} is currently logged in`);
            // // Passing the user into the views
            // res.locals.user = user;
            next();
        }
    })
    
}

module.exports = {
    createToken,
    requireAuth,
    checkUser
};