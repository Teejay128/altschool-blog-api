const User = require('../models/userModel');
const { createToken } = require('../middleware/jwt');
const bcrypt = require('bcrypt')

const signup = async (req, res) => {

    const user = await User.findOne({ email: req.body.email })
    if(user){
        console.log("This user already exists, log in!")
        return res.redirect('/login')
    }
    // // Delete existing user in database
    // await User.findOneAndDelete({ email: "eren@gmail.com" })
    // .then(() => console.log('User removed'))
    // .catch((err) => console.log(err))

    try{
        const user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = createToken(user._id);
        res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });
        return res.json(user)
    }
    catch(err){
        res.status(400).json(err)
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(200).json(user);
    }
    catch(err){
        res.status(400).send(err.message)
    }
}

const logout = (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 });
    res.send('Logged out succesfully')
}

module.exports = {
    signup,
    login,
    logout
}