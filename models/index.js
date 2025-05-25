const Admin = require('./Admin');
const Category = require('./Category');
const Product = require('./Product');
const { Transaction, TransactionItem } = require('./Transaction');

// Category - Product associations
Category.hasMany(Product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Product.belongsTo(Category);

// Admin - Transaction associations
Admin.hasMany(Transaction, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Transaction.belongsTo(Admin);

// Transaction - TransactionItem associations
Transaction.hasMany(TransactionItem, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
TransactionItem.belongsTo(Transaction);

// Product - TransactionItem associations
Product.hasMany(TransactionItem, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
TransactionItem.belongsTo(Product);

module.exports = {
    Admin,
    Category,
    Product,
    Transaction,
    TransactionItem
};