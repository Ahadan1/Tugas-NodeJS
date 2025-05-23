const { configDotenv } = require('dotenv');
const jwt = require('jsonwebtoken');
configDotenv();
const JWT_SECRET = process.env.JWT_SECRET_ENV;

const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET);
}
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    signToken,
    verifyToken
};