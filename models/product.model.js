const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Nama Produk is required'
            },
            len: {
                args: [1, 200],
                msg: 'Nama Produk cannot exceed 200 characters'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Deskripsi Produk is required'
            },
            len: {
                args: [1, 1000],
                msg: 'Deskripsi Produk cannot exceed 1000 characters'
            }
        }
    },
    image: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Gambar Produk is required'
            }
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        },
        validate: {
            notEmpty: {
                msg: 'Kategori Produk is required'
            }
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: {
                args: 0,
                msg: 'Stock cannot be negative'
            }
        }
    }
}, {
    tableName: 'products',
    timestamps: true
});

// Virtual field for stock status
Product.prototype.getStockStatus = function() {
    if (this.stock === 0) return 'Out of Stock';
    if (this.stock <= 10) return 'Low Stock';
    return 'In Stock';
};

module.exports = Product;