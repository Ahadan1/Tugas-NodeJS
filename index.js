const express = require('express');
const sequelize = require('./database');
const { Admin, Category, Product, Transaction, TransactionItem } = require('./models');
const adminRoute = require('./routes/admin.route.js');
const categoryRoute = require('./routes/category.route.js');
const productRoute = require('./routes/product.route.js');
const transactionRoute = require('./routes/transaction.route.js');
const dotenv = require('dotenv');
const app = express();

// Middleware
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Serve static files from public directory
app.use(express.static('public'));

// Routes
app.use("/api/admins", adminRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/transactions", transactionRoute);

// http://localhost:6001/
app.get('/', (req, res) => {
    res.send('Hello from Node API, Server Updated with Transaction Management - MySQL');
});

// Database connection and sync
sequelize.authenticate()
    .then(() => {
        console.log('Connected to MySQL database');
        // Sync database (create tables if they don't exist)
        return sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
    })
    .then(() => {
        console.log('Database synchronized');
        app.listen(6001, () => {
            console.log('Server is running on port 6001');
        });
    })
    .catch((error) => {
        console.log('Failed to connect to MySQL:', error);
    });