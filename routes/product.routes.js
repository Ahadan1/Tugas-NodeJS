// Import required dependencies
const express = require('express');
const router = express.Router();
const { Product, Category } = require('../models');
const auth = require('../middleware/auth');

// GET /api/products
// Get all products with their categories
// Public access
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: Category,
            attributes: ['id', 'name', 'description', 'stock', 'image']
        });
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/products/:id
// Get a single product with its category
// Public access
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: Category
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/products
// Create a new product
// Private access - requires authentication
router.post('/', auth, async (req, res) => {
    try {
        // Create product and fetch with category information
        const product = await Product.create(req.body);
        const productWithCategory = await Product.findByPk(product.id, {
            include: Category
        });
        res.status(201).json(productWithCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/products/:id
// Update an existing product
// Private access - requires authentication
router.put('/:id', auth, async (req, res) => {
    try {
        // Find and update product
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.update(req.body);
        
        // Fetch updated product with category information
        const updatedProduct = await Product.findByPk(product.id, {
            include: Category
        });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/products/:id
// Delete a product
// Private access - requires authentication
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export the router
module.exports = router; 