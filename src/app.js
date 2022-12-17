const express = require('express');
const morgan = require('morgan')
const connectDB = require('./middleware/db')
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes')
const blogRouter = require('./routes/blogRoutes');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"))

app.use(userRouter);
app.use('/blog', blogRouter);

// Coneect to database
connectDB()

// Routes
app.get('/', (req, res) => {
    res.send({ status: true });
});

// 404 page
app.use('*', (req, res) => {
    res.send('404, Page not found')
})

module.exports = app