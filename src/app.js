const express = require('express');
const morgan = require('morgan')
const path = require('path')

const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes')
const articleRouter = require('./routes/articleRoutes')

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', articleRouter);

app.get('/', (req, res) => {
    res.redirect('/api/v1/blog')
    // return res.status(200).json({
    //     status: "success",
    //     message: "Welcome to technobyte"
    // });
});

// 404 page
app.use('*', (req, res) => {
    res.send('404, Page not found')
})

module.exports = app