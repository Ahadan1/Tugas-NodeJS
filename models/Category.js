// Import required dependencies
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Define Category model
const Category = sequelize.define('Category', {
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
    }
});

// Export the Category model
module.exports = Category; 