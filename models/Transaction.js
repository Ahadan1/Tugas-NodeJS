// Import required dependencies
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Define Transaction model for main transaction records
const Transaction = sequelize.define('Transaction', {
    // Type field - required, can only be 'STOCK_IN' or 'STOCK_OUT'
    type: {
        type: DataTypes.ENUM('STOCK_IN', 'STOCK_OUT'),
        allowNull: false
    },
    // Optional description field for transaction details
    description: {
        type: DataTypes.TEXT
    },
    // Date field - automatically set to current timestamp
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Define TransactionItem model for individual items in a transaction
const TransactionItem = sequelize.define('TransactionItem', {
    // Quantity field - required, minimum value of 1
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    // Stock before transaction - required
    stockBefore: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Stock after transaction - required
    stockAfter: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Export both models
module.exports = { Transaction, TransactionItem }; 