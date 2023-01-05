const app = require ("./src/app");

const mongoose = require('mongoose');
require("dotenv").config()

const PORT = process.env.PORT || 4000
const URL = process.env.DB_URL

// Coneect to database
mongoose.connect(URL, { useNewUrlParser: true })
.then(() => console.log('Connected to database.....'))
.catch((err) => console.log('An error occured:', err.message))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})