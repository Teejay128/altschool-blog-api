const User = require('../models/userModel');
const createToken = require('../middleware/jwt');
const errorHandler = require('../middleware/err');

const signup = async (req, res) => {
    try{
        const user = await User.create(req.body);
        const token = createToken(user._id);
        res.cookie('token', token, { secure: false, httpOnly: true, maxAge: "72hrs" })
        console.log('works')
        res.status(201).json({ user: user._id })
    }
    catch(err){
        res.status(400).send(err)
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('token', token, { maxAge: 3 * 24 * 60 * 60 * 1000 })
        res.status(200).json({ user: user._id })
    }
    catch(err){
        errorHandler(err);
        res.status(400).json({})
    }
}

const logout = (req, res) => {
    res.send('Logout successful')
}

module.exports = {
    signup,
    login,
    logout
}