const express = require('express');
const connectDB = require('./middleware/db')
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes')
const blogRouter = require('./routes/blogRoutes');
const { checkUser } = require('./middleware/jwt');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())


// Routes
app.get('*', checkUser)
app.get('/', (req, res) => {
    res.send({ status: true });
});

app.use(userRouter);
app.use('/blog', blogRouter);

app.use('*', (req, res) => {
    res.send('404, Page not found')
})

connectDB()

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})