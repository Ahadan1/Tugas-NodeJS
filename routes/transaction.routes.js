// Import required dependencies
const express = require('express');
const router = express.Router();
const { Transaction, TransactionItem, Product, Admin, Category } = require('../models');
const auth = require('../middleware/auth');
const sequelize = require('../database');

// GET /api/transactions
// Get all transactions with related data
// Private access - requires authentication
router.get('/', auth, async (req, res) => {
    try {
        // Fetch transactions with admin and product details
        const transactions = await Transaction.findAll({
            include: [
                { model: Admin },
                { 
                    model: TransactionItem,
                    include: Product
                }
            ]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/transactions/product/:productId
// Get transaction history for a specific product
// Public access for history view
router.get('/product/:productId', async (req, res) => {
    try {
        // Get the product first
        const product = await Product.findByPk(req.params.productId, {
            include: [Category]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Fetch all transactions for the specified product
        const transactions = await TransactionItem.findAll({
            where: { productId: req.params.productId },
            include: [
                { 
                    model: Transaction,
                    include: [
                        {
                            model: Admin,
                            attributes: ['firstName', 'lastName']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            product: {
                id: product.id,
                name: product.name,
                currentStock: product.stock,
                category: product.Category ? product.Category.name : null
            },
            transactions: transactions.map(item => ({
                id: item.Transaction.id,
                type: item.Transaction.type,
                description: item.Transaction.description,
                quantity: item.quantity,
                stockBefore: item.stockBefore,
                stockAfter: item.stockAfter,
                admin: item.Transaction.Admin ? {
                    firstName: item.Transaction.Admin.firstName,
                    lastName: item.Transaction.Admin.lastName
                } : null,
                createdAt: item.Transaction.createdAt,
                status: 'COMPLETED'
            }))
        });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/transactions
// Create a new transaction (stock in/out)
// Private access - requires authentication
router.post('/', auth, async (req, res) => {
    // Start database transaction
    const t = await sequelize.transaction();
    
    try {
        const { type, description, items } = req.body;
        
        // Create main transaction record
        const transaction = await Transaction.create({
            type,
            description,
            adminId: req.admin.id
        }, { transaction: t });

        // Process each item in the transaction
        for (const item of items) {
            // Lock the product record for update
            const product = await Product.findByPk(item.productId, { 
                transaction: t,
                lock: true
            });

            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            // Calculate new stock level
            const stockBefore = product.stock;
            let stockAfter;

            if (type === 'STOCK_OUT') {
                // Check if enough stock is available
                if (stockBefore < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}`);
                }
                stockAfter = stockBefore - item.quantity;
            } else {
                stockAfter = stockBefore + item.quantity;
            }

            // Update product stock
            await product.update({ stock: stockAfter }, { transaction: t });

            // Create transaction item record
            await TransactionItem.create({
                transactionId: transaction.id,
                productId: item.productId,
                quantity: item.quantity,
                stockBefore,
                stockAfter
            }, { transaction: t });
        }

        // Commit the transaction
        await t.commit();

        // Fetch complete transaction data
        const completedTransaction = await Transaction.findByPk(transaction.id, {
            include: [
                { model: Admin },
                { 
                    model: TransactionItem,
                    include: Product
                }
            ]
        });

        res.status(201).json(completedTransaction);
    } catch (error) {
        // Rollback transaction if error occurs
        await t.rollback();
        res.status(400).json({ message: error.message });
    }
});

// Export the router
module.exports = router; 