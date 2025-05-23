const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Nama Kategori is required'
            },
            len: {
                args: [1, 100],
                msg: 'Nama Kategori cannot exceed 100 characters'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Deskripsi Kategori is required'
            },
            len: {
                args: [1, 500],
                msg: 'Deskripsi Kategori cannot exceed 500 characters'
            }
        }
    }
}, {
    tableName: 'categories',
    timestamps: true
});

module.exports = Category;