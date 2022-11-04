const User = require('../models/userModel');
const createToken = require('../middleware/jwt');

const signup = async (req, res) => {
    // Delete existing user in database
    await User.findOneAndDelete({ email: "eren@gmail.com" })
    .then(() => console.log('User removed'))
    .catch((err) => console.log(err))

    const user = new User(req.body);
    await user.save();
    const token = createToken(user.id)
    res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 })
    return res.json({ user })
}

const login = (req, res) => {
    console.log('accessed an unsecure route')
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