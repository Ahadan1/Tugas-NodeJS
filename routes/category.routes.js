// Import required dependencies
const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const auth = require('../middleware/auth');

// GET /api/categories
// Get all categories
// Public access
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/categories/:id
// Get a single category by ID
// Public access
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/categories
// Create a new category
// Private access - requires authentication
router.post('/', auth, async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/categories/:id
// Update an existing category
// Private access - requires authentication
router.put('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.update(req.body);
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/categories/:id
// Delete a category
// Private access - requires authentication
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export the router
module.exports = router; 