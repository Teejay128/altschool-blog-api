const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
require('dotenv').config();

const maxAge = 60 * 60;
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
            console.log(`User with Id:${decodedToken.id} has logged out`);
            next();
        }
    })
    
}

const checkUser = async (req, res) => {
    const token = req.cookies.jwt;
    
    if(!token){
        console.log('No token');
        return  "no user"
    }

    const user = jwt.verify(token, process.env.JWT_SECRET)
    return user.id

}

module.exports = {
    createToken,
    requireAuth,
    checkUser
};