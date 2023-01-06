const User = require('../models/userModel');
const { createToken } = require('../middleware/jwt');
const bcrypt = require('bcrypt')

const signup = async (req, res) => {

    /**
     * Function to create a new user
     * 
     * If user alread exists, log them in
     * 
     * Creates a token with a maxAge of 1 hour
     * 
     * Saves the token into a cookie called "jwt"
     * 
     * 
     * If any error occurs send the error message to the user
     */
    const user = await User.findOne({ email: req.body.email })
    if(user){
        console.log("This user already exists, you have been logged in!")
        return res.redirect('/api/v1/user/login')
    }

    try{
        const user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = createToken(user._id);
        res.cookie('jwt', token, { maxAge: 60 * 60 * 1000 });

        return res.status(201).json({
            status: "success",
            message: "Sign up successful!, you have been automatically logged in",
            data: {
                firstName: user.firstName,
                lastname: user.lastName,
                email: user.email,
                articles: user.articles,
                id: user._id
            }
        })
    }
    catch(err){
        res.status(400).send(err.message)
    }
}

const login = async (req, res) => {
    
    /**
     * Function to log in a registered user
     * 
     * Creates a token with a maxAge of 1 hour
     * 
     * Saves the token into a cookie called "jwt"
     * 
     * 
     * If any error occurs send them to the user, because they are the users problems now 
     */
    const { email, password } = req.body;

    try{
        const user = await User.login(email, password);

        const token = createToken(user._id);
        
        res.cookie('jwt', token, { maxAge: 60 * 60 * 1000 });
        res.status(201).json({
            status: "success",
            message: "You logged in successfully",
            data: {
                firstName: user.firstName,
                lastname: user.lastName,
                email: user.email,
                articles: user.articles,
                id: user._id
            }
        });
    }
    catch(err){
        res.status(400).send(err.message)
    }
}
/**
 * Function to log out a user
 * 
 * Sets the jwt cookie to an empty string that expires in 1 millisecond
 */
const logout = (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 });
    res.send('Logged out succesfully')
}

module.exports = {
    signup,
    login,
    logout
}