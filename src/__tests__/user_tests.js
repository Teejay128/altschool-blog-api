const request = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const User = require('../models/userModel')
const connectDB = require('../middleware/db')

describe("Test for User routes", () => {
    beforeAll(() => {
        connectDB()
    })
    
    beforeAll(() => {
        console.log()
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    test("User sign up", async () => {
        request(app)
            .post("/signup")
            .expect("Content-Type", /json/)
            .send({
                firstName: "armin",
                lastName: "arlert",
                email: "armin@gmail.com",
                password: "sea",
            })
            .expect(201, (res) => {
                res.body.status = "success"
                res.body.data.user.firstName = "armin"
                res.body.data.user.lastName = "arlert"
                res.body.data.user.email = "armin@gmail.com"
                res.body.data.user.__v = 0
            })
    }, 120000)

    test("User Log in", async () => {
        request(app)
            .post("/login")
            .expect("Content-Type", /json/)
            .send({
                email: "armin@gmail.com",
                password: "sea"
            })
            .expect(201, (res) => {
                res.body.status = "success"
                res.body.data.user.lastName = "armin"
                res.body.data.user.lastName = "arlert"
            })
    })
})