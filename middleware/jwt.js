const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch(err){
        res.clearCookie("jwt");
        return res.redirect("/");
    }
}

module.exports = requireAuth;