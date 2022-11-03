const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: 3 * 24 * 60 * 60 });
}