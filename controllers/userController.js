const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (req, res) => {
    User.findOneAndRemove({ email: "eren@gmail.com" })
    .then(() => console.log("Removed eren successfully"))
    .catch((err) => console.log(err))

    const user = new User(req.body);
    await user.save();
    const token = jwt.sign(user.id, process.env.JWT_SECRET)
    res.cookie('jwt', token);
    return res.json({ user });
}

const login = (req, res) => {
    console.log('Accesed an unsecure route')
    res.send('Login successful')
}

const logout = (req, res) => {
    console.log('Accesed a secure route')
    res.send('Logout successful')
}

module.exports = {
    signup,
    login,
    logout
}