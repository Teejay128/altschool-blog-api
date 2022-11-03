const jwt = require('jsonwebtoken');
const errorHandler = require('../middleware/err')
require('dotenv').config();

module.exports = requireAuth = (req, res, next) => {
    console.log(req)
    console.log(req.cookie)
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decodedToken) => {
            if(err){
                errorHandler(err);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect('/login');
    }

}