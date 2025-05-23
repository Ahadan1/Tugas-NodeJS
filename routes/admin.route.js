const express = require('express');
const Admin = require('../models/admin.model.js');
const router = express.Router();
const {getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin, loginAdmin, logoutAdmin} = require('../controllers/admin.controller.js');

router.get('/', getAdmins);
router.get('/:id', getAdmin);
router.post('/', createAdmin);
router.post('/login', loginAdmin);
router.post('/logout/:id', logoutAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;

