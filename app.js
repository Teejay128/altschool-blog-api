const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
});

// Connect to database
mongoose.connect(process.env.DB_URI)
.then(() => console.log('Connected to database.....'))
.catch((err) => console.log('An error occured:', err.message))

app.listen(PORT, () => {
    console.log("Server is up and running at localhost:port", PORT);
});