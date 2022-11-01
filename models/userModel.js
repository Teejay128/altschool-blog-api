const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
    },
    password: {
        type: String
    },
    blogs: {
        type: Array,
    }
});

UserSchema.pre('save', async function(next) {
    this.password = bcrypt.hash(this.password, 10);

    next()
})

const User = mongoose.model('users', UserSchema);

module.exports = User;