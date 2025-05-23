const express = require('express');
const Product = require('../models/product.model.js');
const router = express.Router();
const {
    getProducts,
    getProduct,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    searchProducts
} = require('../controllers/product.controller.js');

// GET search products (harus sebelum /:id route)
router.get('/search', searchProducts);

// GET all products
router.get('/', getProducts);

// GET products by category
router.get('/category/:categoryId', getProductsByCategory);

// GET single product by ID
router.get('/:id', getProduct);

// POST create new product
router.post('/', createProduct);

// PUT update product by ID
router.put('/:id', updateProduct);

// PATCH update stock only
router.patch('/:id/stock', updateStock);

// DELETE product by ID
router.delete('/:id', deleteProduct);

module.exports = router;