const express = require('express');
const connectDB = require('./middleware/db')
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send({ status: true });
});

connectDB()

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})