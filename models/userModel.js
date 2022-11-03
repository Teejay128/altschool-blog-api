const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "This email is already registered, sign in!!"]
    },
    first_name: {
        type: String,
        required: [true, "Please enter your first name"]
    },
    last_name: {
        type: String,
        required: [true, "Please enter your last name"]
    },
    password: {
        type: String,
        required: true
    },
    blogs: {
        type: Array,
    }
});

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
});

// Statics method to login user
UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('Incorrect password')
    }

    throw Error('Incorrect email')
}


const User = mongoose.model('users', UserSchema);

module.exports = User;