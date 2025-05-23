const express = require('express');
const Category = require('../models/category.model.js');
const router = express.Router();
const {
    getCategories, 
    getCategory, 
    createCategory, 
    updateCategory, 
    deleteCategory
} = require('../controllers/category.controller.js');

// GET all categories
router.get('/', getCategories);

// GET single category by ID
router.get('/:id', getCategory);

// POST create new category
router.post('/', createCategory);

// PUT update category by ID
router.put('/:id', updateCategory);

// DELETE category by ID
router.delete('/:id', deleteCategory);

module.exports = router;