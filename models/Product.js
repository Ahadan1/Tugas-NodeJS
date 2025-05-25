// Import required dependencies
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Define Product model
const Product = sequelize.define('Product', {
    // Name field - required, unique, non-empty string
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    // Description field - required, non-empty text
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Image field - required, stores image path/URL
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Stock field - required, integer, minimum value of 0
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
});

// Export the Product model
module.exports = Product; 