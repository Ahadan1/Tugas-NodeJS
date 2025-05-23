const Admin = require('./admin.model');
const Category = require('./category.model');
const Product = require('./product.model');
const { Transaction, TransactionItem } = require('./transaction.model');

// Define associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Admin.hasMany(Transaction, { foreignKey: 'adminId', as: 'transactions' });
Transaction.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });

Transaction.hasMany(TransactionItem, { foreignKey: 'transactionId', as: 'items' });
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });

Product.hasMany(TransactionItem, { foreignKey: 'productId', as: 'transactionItems' });
TransactionItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
    Admin,
    Category,
    Product,
    Transaction,
    TransactionItem
};