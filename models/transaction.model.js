const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transactionNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('STOCK_IN', 'STOCK_OUT'),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Transaction type is required'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'Description cannot exceed 500 characters'
            }
        }
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'admins',
            key: 'id'
        },
        validate: {
            notEmpty: {
                msg: 'Admin is required'
            }
        }
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
        defaultValue: 'PENDING'
    },
    processedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'transactions',
    timestamps: true,
    hooks: {
        beforeCreate: async (transaction, options) => {
            if (!transaction.transactionNumber) {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                
                const prefix = `TRX-${year}${month}${day}`;
                
                // Find last transaction for today
                const lastTransaction = await Transaction.findOne({
                    where: {
                        transactionNumber: {
                            [sequelize.Sequelize.Op.like]: `${prefix}%`
                        }
                    },
                    order: [['transactionNumber', 'DESC']]
                });
                
                let sequence = 1;
                if (lastTransaction) {
                    const lastSequence = parseInt(lastTransaction.transactionNumber.split('-')[2]);
                    sequence = lastSequence + 1;
                }
                
                transaction.transactionNumber = `${prefix}-${String(sequence).padStart(3, '0')}`;
            }
        }
    }
});

const TransactionItem = sequelize.define('TransactionItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'transactions',
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        },
        validate: {
            notEmpty: {
                msg: 'Produk is required'
            }
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: 1,
                msg: 'Quantity must be at least 1'
            }
        }
    },
    stockBefore: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stockAfter: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'transaction_items',
    timestamps: true
});

module.exports = { Transaction, TransactionItem };