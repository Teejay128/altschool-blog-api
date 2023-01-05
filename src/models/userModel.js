const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"]
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"]
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "This email is already registered, sign in!!"]
    },
    password: {
        type: String,
        required: true,
        
    },
    articles: {
        type: Array,
    }
});

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns user
 * 
 * static function to login user
 * 
 * Checks for user with email property
 * 
 * And compare hashed password with provided password
 * 
 * Returns user
 */
UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if(!user){
        throw Error('Incorect email, try again or sign up!');
    }

    const auth = await bcrypt.compare(password, user.password);
    if(!auth){
        throw Error('Incorrect password');
    }

    return user
}


const User = mongoose.model('users', UserSchema);

module.exports = User;