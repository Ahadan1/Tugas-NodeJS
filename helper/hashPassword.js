const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const saltRounds = process.env.gudang_garam;

const hashPassword = (password) => {
    return bcrypt.hashSync(password, saltRounds);
};

const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = {
    hashPassword,
    comparePassword
};