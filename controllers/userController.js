const User = require('../models/userModel');
const createToken = require('../middleware/jwt');
const errorHandler = require('../middleware/err');

const signup = async (req, res) => {

    await User.findOneAndDelete({ email: 'eren@gmail.com'})
    .then(() => console.log('User Removed'))
    .catch((err) => errorHandler(err));

    try{
        const user = new User(req.body);
        await user.save();
        const token = createToken(user.id);
        res.cookie('jwt', token, { maxAge: "3d" })
        res.status(201).json({ user: user._id })
    }
    catch(err){
        console.log("An error occcured")
        res.status(400).send(err)
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 })
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