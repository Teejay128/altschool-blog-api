const express = require('express');
const morgan = require('morgan')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require("express-rate-limit");

const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes')
const articleRouter = require('./routes/articleRoutes');
const { each } = require('lodash');

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(morgan("tiny"));

app.set('trust proxy', 1) // Trust the first proxy

app.use(
    rateLimit({
        windowMs: 60 * 60 * 1000, // 1 minute
        max: 50, // 50 requests per minute
        standardHeaders: true,
        legacyHeaders: false
    })
)

app.use(helmet())

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', articleRouter);

app.get('/', (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "This is my altschool blogging api project"
    })
});

// 404 page
app.use('*', (req, res) => {
    res.send('404, Page not found')
})

module.exports = app