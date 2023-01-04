const express = require('express');
const morgan = require('morgan')
const path = require('path')

const connectDB = require('./middleware/db')
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes')
const blogRouter = require('./routes/blogRoutes')
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

// Coneect to database
connectDB()

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRouter);

app.get('/', (req, res) => {
    res.send({ status: true });
});

// 404 page
app.use('*', (req, res) => {
    res.send('404, Page not found')
})

module.exports = app