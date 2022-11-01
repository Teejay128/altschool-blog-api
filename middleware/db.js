const mongoose = require('mongoose');


const connectDB = () => {
    mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to database.....'))
    .catch((err) => console.log('An error occured:', err.message))
}

module.exports = connectDB