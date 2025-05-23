const express = require('express');
const Transaction = require('../models/transaction.model.js');
const router = express.Router();
const {
    getTransactions,
    getTransaction,
    createTransaction,
    cancelTransaction,
    getTransactionSummary,
    getProductTransactionHistory
} = require('../controllers/transaction.controller.js');

// GET transaction summary (harus sebelum /:id route)
router.get('/summary', getTransactionSummary);

// GET product transaction history
router.get('/product/:productId/history', getProductTransactionHistory);

// GET all transactions with filtering
router.get('/', getTransactions);

// GET single transaction by ID
router.get('/:id', getTransaction);

// POST create new transaction
router.post('/', createTransaction);

// PATCH cancel transaction
router.patch('/:id/cancel', cancelTransaction);

module.exports = router;