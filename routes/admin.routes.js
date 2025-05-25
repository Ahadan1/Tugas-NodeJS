// Import required dependencies
const express = require('express');
const router = express.Router();
const { Admin } = require('../models');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// POST /api/admin/register
// Register a new admin user
// Public access
router.post('/register', async (req, res) => {
    try {
        const admin = await Admin.create(req.body);
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);
        res.status(201).json({ admin, token });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }
        res.status(400).json({ 
            message: error.message,
            type: error.name
        });
    }
});

// POST /api/admin/login
// Login for existing admin
// Public access
router.post('/login', async (req, res) => {
    try {
        // Extract credentials from request body
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email } });
        
        // Validate credentials
        if (!admin || !(await admin.validatePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate and send JWT token
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);
        res.json({ admin, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/admin/profile
// Get current admin's profile
// Private access - requires authentication
router.get('/profile', auth, async (req, res) => {
    res.json(req.admin);
});

// PUT /api/admin/profile
// Update current admin's profile
// Private access - requires authentication
router.put('/profile', auth, async (req, res) => {
    try {
        // Update all fields provided in request body
        const updates = Object.keys(req.body);
        updates.forEach(update => req.admin[update] = req.body[update]);
        await req.admin.save();
        res.json(req.admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/admin
// Get all admins (excluding passwords)
// Private access - requires authentication
router.get('/', auth, async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export the router
module.exports = router; 