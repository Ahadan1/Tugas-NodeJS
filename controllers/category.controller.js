const Category = require('../models/category.model');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({categories});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }
        res.status(200).json({category});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const createCategory = async (req, res) => {
    try {
        const {name, description} = req.body;
        
        // Validasi input
        if (!name || !description) {
            return res.status(400).json({message: 'Name and description are required'});
        }

        // Cek apakah category dengan nama yang sama sudah ada
        const existingCategory = await Category.findOne({where: {name}});
        if (existingCategory) {
            return res.status(400).json({message: 'Category with this name already exists'});
        }

        const categoryData = {
            name,
            description
        };

        const category = await Category.create(categoryData);
        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const updateCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description} = req.body;

        // Cek apakah category exists
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }

        // Jika name diubah, cek apakah nama baru sudah ada
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({where: {name}});
            if (existingCategory) {
                return res.status(400).json({message: 'Category with this name already exists'});
            }
        }

        await Category.update(req.body, {where: {id}});
        const updatedCategory = await Category.findByPk(id);

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params;
        
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }

        await Category.destroy({where: {id}});
        
        res.status(200).json({
            message: 'Category deleted successfully',
            deletedCategory: category
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};
