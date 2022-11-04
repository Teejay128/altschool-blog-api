const jwt = require('jsonwebtoken');
require('dotenv').config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decodedToken) => {
            if(err){
                console.log(err)
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        console.log('No token')
        res.redirect('/login');
    }

}

module.exports = requireAuth;