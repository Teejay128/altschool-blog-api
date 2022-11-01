const mongoose = require('mongoose');
const User = require('../models/userModel');

const signup = async (req, res) => {
    const user = new User(req.body);

    await user.save();

    return res.json({ status: true, user })
}

const login = (req, res) => {
    res.send('Login successful')
}

const logout = (req, res) => {
    res.send('Logout successful')
}

module.exports = {
    signup,
    login,
    logout
}