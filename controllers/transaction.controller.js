const { Transaction, TransactionItem, Product, Admin, Category } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../database');

// Helper function to generate transaction number
const generateTransactionNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getTime()).slice(-6); // Last 6 digits of timestamp
    return `TXN-${year}${month}${day}-${time}`;
};

const getTransactions = async (req, res) => {
    try {
        const { type, status, admin, startDate, endDate, page = 1, limit = 10 } = req.query;
        
        let whereClause = {};
        
        // Filter by type
        if (type) {
            whereClause.type = type;
        }
        
        // Filter by status
        if (status) {
            whereClause.status = status;
        }
        
        // Filter by admin
        if (admin) {
            whereClause.adminId = admin;
        }
        
        // Filter by date range
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
            if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
        }
        
        const offset = (page - 1) * limit;
        
        const { count, rows: transactions } = await Transaction.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Admin,
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: TransactionItem,
                    as: 'items', // Add alias for consistency
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'description']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            offset: parseInt(offset),
            limit: parseInt(limit)
        });
        
        res.status(200).json({
            transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        
        const transaction = await Transaction.findByPk(id, {
            include: [
                {
                    model: Admin,
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: TransactionItem,
                    as: 'items', // Add alias for consistency
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'description', 'categoryId'],
                            include: [
                                {
                                    model: Category,
                                    attributes: ['name']
                                }
                            ]
                        }
                    ]
                }
            ]
        });
            
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        res.status(200).json({ transaction });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ message: error.message });
    }
};

const createTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { type, description, items, adminId } = req.body;
        
        console.log('Creating transaction with data:', { type, description, items, adminId });
        
        // Validasi input
        if (!type || !items || !Array.isArray(items) || items.length === 0 || !adminId) {
            await t.rollback();
            return res.status(400).json({
                message: 'Type, items array, and adminId are required'
            });
        }
        
        if (!['STOCK_IN', 'STOCK_OUT'].includes(type)) {
            await t.rollback();
            return res.status(400).json({
                message: 'Type must be either STOCK_IN or STOCK_OUT'
            });
        }
        
        // Validasi admin exists
        const admin = await Admin.findByPk(adminId, { transaction: t });
        if (!admin) {
            await t.rollback();
            return res.status(404).json({ message: 'Admin not found' });
        }
        
        // Generate transaction number
        const transactionNumber = generateTransactionNumber();
        
        // Create transaction first
        const transaction = await Transaction.create({
            transactionNumber,
            type,
            description: description || null,
            adminId,
            status: 'COMPLETED',
            processedAt: new Date()
        }, { transaction: t });
        
        console.log('Transaction created with ID:', transaction.id);
        
        // Validasi dan prepare transaction items
        for (const item of items) {
            const { productId, quantity } = item;
            
            console.log('Processing item:', { productId, quantity });
            
            // Validate quantity
            const quantityNumber = Number(quantity);
            if (!productId || !quantity || isNaN(quantityNumber) || quantityNumber <= 0) {
                await t.rollback();
                return res.status(400).json({
                    message: 'Each item must have productId and positive quantity'
                });
            }
            
            // Get product dengan transaction untuk lock
            const product = await Product.findByPk(productId, { 
                transaction: t,
                lock: true 
            });
            if (!product) {
                await t.rollback();
                return res.status(404).json({
                    message: `Product with ID ${productId} not found`
                });
            }
            
            console.log('Product found:', { id: product.id, name: product.name, currentStock: product.stock });
            
            const stockBefore = product.stock;
            let stockAfter;
            
            if (type === 'STOCK_OUT') {
                if (stockBefore < quantityNumber) {
                    await t.rollback();
                    return res.status(400).json({
                        message: `Insufficient stock for product ${product.name}. Available: ${stockBefore}, Requested: ${quantityNumber}`
                    });
                }
                stockAfter = stockBefore - quantityNumber;
            } else { // STOCK_IN
                stockAfter = stockBefore + quantityNumber;
            }
            
            console.log('Stock calculation:', { stockBefore, quantityNumber, stockAfter, type });
            
            // Ensure stockAfter is not negative (this should not happen for STOCK_IN, but let's be safe)
            if (stockAfter < 0) {
                await t.rollback();
                return res.status(400).json({
                    message: `Stock calculation resulted in negative value for product ${product.name}`
                });
            }
            
            // Update product stock
            await Product.update(
                { stock: stockAfter },
                { 
                    where: { id: productId },
                    transaction: t 
                }
            );
            
            console.log('Product stock updated successfully');
            
            // Create transaction item
            await TransactionItem.create({
                transactionId: transaction.id,
                productId,
                quantity: quantityNumber,
                stockBefore,
                stockAfter
            }, { transaction: t });
            
            console.log('Transaction item created successfully');
        }
        
        await t.commit();
        console.log('Transaction committed successfully');
        
        // Get populated transaction for response
        const populatedTransaction = await Transaction.findByPk(transaction.id, {
            include: [
                {
                    model: Admin,
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: TransactionItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'description']
                        }
                    ]
                }
            ]
        });
        
        res.status(201).json({
            message: 'Transaction created successfully',
            transaction: populatedTransaction
        });
        
    } catch (error) {
        console.error('Create transaction error:', error);
        await t.rollback();
        
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message,
                value: err.value
            }));
            return res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        }
        
        res.status(500).json({ message: error.message });
    }
};

const cancelTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { id } = req.params;
        
        const transaction = await Transaction.findByPk(id, { transaction: t });
        if (!transaction) {
            await t.rollback();
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        if (transaction.status !== 'PENDING') {
            await t.rollback();
            return res.status(400).json({
                message: 'Only pending transactions can be cancelled'
            });
        }
        
        // Update transaction status
        await Transaction.update(
            { status: 'CANCELLED' },
            { 
                where: { id },
                transaction: t 
            }
        );
        
        await t.commit();
        
        const updatedTransaction = await Transaction.findByPk(id);
        
        res.status(200).json({
            message: 'Transaction cancelled successfully',
            transaction: updatedTransaction
        });
        
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

const getTransactionSummary = async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;
        
        let whereClause = {};
        
        // Filter by date range
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
            if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
        }
        
        // Filter by type
        if (type) {
            whereClause.type = type;
        }
        
        // Get type summary
        const typeSummary = await Transaction.findAll({
            where: whereClause,
            attributes: [
                'type',
                [sequelize.fn('COUNT', sequelize.col('Transaction.id')), 'totalTransactions'],
                [sequelize.fn('COUNT', sequelize.col('items.id')), 'totalItems'],
                [sequelize.fn('SUM', sequelize.col('items.quantity')), 'totalQuantity']
            ],
            include: [
                {
                    model: TransactionItem,
                    as: 'items',
                    attributes: []
                }
            ],
            group: ['type'],
            raw: true
        });
        
        // Get status summary
        const statusSummary = await Transaction.findAll({
            where: whereClause,
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });
        
        res.status(200).json({
            typeSummary,
            statusSummary
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductTransactionHistory = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        // Validasi product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const offset = (page - 1) * limit;
        
        const { count, rows: transactions } = await Transaction.findAndCountAll({
            include: [
                {
                    model: Admin,
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: TransactionItem,
                    as: 'items',
                    where: { productId },
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'description']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            offset: parseInt(offset),
            limit: parseInt(limit)
        });
        
        res.status(200).json({
            product: {
                name: product.name,
                currentStock: product.stock
            },
            transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error('Get product transaction history error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    getTransaction,
    createTransaction,
    cancelTransaction,
    getTransactionSummary,
    getProductTransactionHistory
};