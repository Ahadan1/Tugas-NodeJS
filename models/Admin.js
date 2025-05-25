// Import required dependencies
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcryptjs');

// Define Admin model
const Admin = sequelize.define('Admin', {
    // First name field - required, non-empty string
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Last name field - required, non-empty string
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Email field - required, unique, must be valid email format
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    // Password field - required, will be hashed before saving
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Birth date field - required, stores date only
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    // Gender field - required, can only be 'male' or 'female'
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false
    }
}, {
    // Hooks for password hashing
    hooks: {
        // Hash password before creating new admin
        beforeCreate: async (admin) => {
            if (admin.password) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        },
        // Hash password before updating if it was changed
        beforeUpdate: async (admin) => {
            if (admin.changed('password')) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        }
    }
});

// Instance method to validate password
Admin.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Export the Admin model
module.exports = Admin; 