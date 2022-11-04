const User = require('../models/userModel');
const { createToken } = require('../middleware/jwt');

const signup = async (req, res) => {

    // Delete existing user in database
    await User.findOneAndDelete({ email: "eren@gmail.com" })
    .then(() => console.log('User removed'))
    .catch((err) => console.log(err))

    const user = new User(req.body);
    await user.save();
    const token = createToken(user._id);
    res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });
    return res.json({ user: user._id })
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ user: user._id});
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