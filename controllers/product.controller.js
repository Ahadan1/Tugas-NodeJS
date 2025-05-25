const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { Op } = require('sequelize');

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name', 'description']
                }
            ]
        });
        res.status(200).json({products});
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({message: error.message})
    }
}

const getProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name', 'description']
                }
            ]
        });
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json({product});
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({message: error.message})
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const {categoryId} = req.params;
        
        // Cek apakah category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }

        const products = await Product.findAll({
            where: {categoryId},
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name', 'description']
                }
            ]
        });
        
        res.status(200).json({
            category: category.name,
            products
        });
    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({message: error.message})
    }
};

const createProduct = async (req, res) => {
    try {
        const {name, description, image, categoryId, stock} = req.body;
        
        console.log('Create product request body:', req.body);
        console.log('Stock value type:', typeof stock, 'Value:', stock);
        
        // Validasi input
        if (!name || !description || !image || !categoryId || stock === undefined || stock === null) {
            return res.status(400).json({
                message: 'All fields are required: name, description, image, categoryId, stock'
            });
        }

        // Convert stock to number and validate
        const stockNumber = Number(stock);
        console.log('Converted stock number:', stockNumber, 'Is valid number:', !isNaN(stockNumber));
        
        if (isNaN(stockNumber)) {
            return res.status(400).json({
                message: 'Stock must be a valid number',
                receivedValue: stock,
                convertedValue: stockNumber
            });
        }

        if (stockNumber < 0) {
            return res.status(400).json({
                message: 'Stock cannot be negative',
                receivedValue: stock,
                convertedValue: stockNumber
            });
        }

        // Convert categoryId to number and validate
        const categoryIdNumber = Number(categoryId);
        console.log('Category ID:', categoryIdNumber);
        
        if (isNaN(categoryIdNumber)) {
            return res.status(400).json({
                message: 'CategoryId must be a valid number',
                receivedValue: categoryId
            });
        }

        // Cek apakah category exists
        const categoryExists = await Category.findByPk(categoryIdNumber);
        if (!categoryExists) {
            return res.status(400).json({
                message: 'Category not found',
                categoryId: categoryIdNumber
            });
        }

        // Cek apakah product dengan nama yang sama sudah ada
        const existingProduct = await Product.findOne({where: {name}});
        if (existingProduct) {
            return res.status(400).json({message: 'Product with this name already exists'});
        }

        const productData = {
            name,
            description,
            image,
            categoryId: categoryIdNumber,
            stock: stockNumber
        };

        console.log('Creating product with data:', productData);

        const product = await Product.create(productData);
        
        // Get the created product with category info
        const populatedProduct = await Product.findByPk(product.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name', 'description']
                }
            ]
        });
        
        res.status(201).json({
            message: 'Product created successfully',
            product: populatedProduct
        });
    } catch (error) {
        console.error('Create product error:', error);
        
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message,
                value: err.value,
                validatorKey: err.validatorKey,
                validatorName: err.validatorName
            }));
            return res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        }
        
        // Handle foreign key constraint errors
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({message: 'Invalid category reference'});
        }
        
        res.status(500).json({
            message: error.message,
            type: error.name,
            details: error
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description, image, categoryId, stock} = req.body;

        console.log('Update product request:', {id, body: req.body});

        // Cek apakah product exists
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        // Prepare update data
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        
        if (categoryId !== undefined) {
            const categoryIdNumber = Number(categoryId);
            if (isNaN(categoryIdNumber)) {
                return res.status(400).json({message: 'CategoryId must be a valid number'});
            }
            
            // Cek apakah category exists
            const categoryExists = await Category.findByPk(categoryIdNumber);
            if (!categoryExists) {
                return res.status(400).json({message: 'Category not found'});
            }
            updateData.categoryId = categoryIdNumber;
        }
        
        if (stock !== undefined) {
            const stockNumber = Number(stock);
            if (isNaN(stockNumber)) {
                return res.status(400).json({message: 'Stock must be a valid number'});
            }
            if (stockNumber < 0) {
                return res.status(400).json({message: 'Stock cannot be negative'});
            }
            updateData.stock = stockNumber;
        }

        // Jika name diubah, cek apakah nama baru sudah ada
        if (name && name !== product.name) {
            const existingProduct = await Product.findOne({where: {name}});
            if (existingProduct) {
                return res.status(400).json({message: 'Product with this name already exists'});
            }
        }

        console.log('Updating product with data:', updateData);

        await Product.update(updateData, {where: {id}});
        
        const updatedProduct = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ['name', 'description']
                }
            ]
        });

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        }
        
        res.status(500).json({message: error.message});
    }
};

const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ['name', 'description']
                }
            ]
        });
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        await Product.destroy({where: {id}});
        
        res.status(200).json({
            message: 'Product deleted successfully',
            deletedProduct: product
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({message: error.message});
    }
};

const updateStock = async (req, res) => {
    try {
        const {id} = req.params;
        const {stock, operation} = req.body;

        // Validasi input
        if (stock === undefined || !operation) {
            return res.status(400).json({
                message: 'Stock amount and operation (add/subtract/set) are required'
            });
        }

        const stockNumber = Number(stock);
        if (isNaN(stockNumber) || stockNumber < 0) {
            return res.status(400).json({message: 'Stock amount must be a positive number'});
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        let newStock;
        switch (operation) {
            case 'add':
                newStock = product.stock + stockNumber;
                break;
            case 'subtract':
                newStock = product.stock - stockNumber;
                if (newStock < 0) {
                    return res.status(400).json({message: 'Insufficient stock'});
                }
                break;
            case 'set':
                newStock = stockNumber;
                break;
            default:
                return res.status(400).json({message: 'Invalid operation. Use: add, subtract, or set'});
        }

        await Product.update({stock: newStock}, {where: {id}});
        
        const updatedProduct = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ['name', 'description']
                }
            ]
        });

        res.status(200).json({
            message: `Stock ${operation} successfully`,
            product: updatedProduct
        });
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({message: error.message});
    }
};

const searchProducts = async (req, res) => {
    try {
        const {query, categoryId, minStock, maxStock} = req.query;
        
        let searchCriteria = {};

        // Search by name or description
        if (query) {
            searchCriteria[Op.or] = [
                {name: {[Op.like]: `%${query}%`}},
                {description: {[Op.like]: `%${query}%`}}
            ];
        }

        // Filter by category
        if (categoryId) {
            const categoryIdNumber = Number(categoryId);
            if (!isNaN(categoryIdNumber)) {
                searchCriteria.categoryId = categoryIdNumber;
            }
        }

        // Filter by stock range
        if (minStock !== undefined || maxStock !== undefined) {
            searchCriteria.stock = {};
            if (minStock !== undefined) {
                const minStockNumber = Number(minStock);
                if (!isNaN(minStockNumber)) {
                    searchCriteria.stock[Op.gte] = minStockNumber;
                }
            }
            if (maxStock !== undefined) {
                const maxStockNumber = Number(maxStock);
                if (!isNaN(maxStockNumber)) {
                    searchCriteria.stock[Op.lte] = maxStockNumber;
                }
            }
        }

        const products = await Product.findAll({
            where: searchCriteria,
            include: [
                {
                    model: Category,
                    attributes: ['name', 'description']
                }
            ]
        });
        
        res.status(200).json({
            searchCriteria,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getProducts,
    getProduct,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    searchProducts
};