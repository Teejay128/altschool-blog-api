const mongoose = require('mongoose');


module.exports = connectDB = () => {
    mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to database.....'))
    .catch((err) => console.log('An error occured:', err.message))
}
