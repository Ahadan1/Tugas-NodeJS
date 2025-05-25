const Admin = require('../models/admin.model');
const {hashPassword , comparePassword} = require('../helper/hashPassword');
const {signToken} = require('../helper/jwt');

const getAdmins = async (req, res) => {
    try {
        const admin = await Admin.findAll(); // Changed from find({}) to findAll()
        res.status(200).json({admin});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const admin = await Admin.findByPk(id); // Changed from findById to findByPk
        if (!admin) {
            return res.status(404).json({message: 'Admin not found'});
        }
        res.status(200).json({admin});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const loginAdmin = async (req, res) => {
    try{
        const {email, password} = req.body;
        const admin = await Admin.findOne({where: {email}}); // Added where clause
        if(!admin){
            return res.status(404).json({message: 'Admin not found'});
        }
        
        const isMatch = comparePassword(password, admin.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid password'});
        }
        
        // Create admin data for token
        const adminData = {
            id: admin.id, // Changed from admin._id to admin.id
            firstName: admin.firstName, 
            lastName: admin.lastName, 
            email: admin.email, 
            birthDate: admin.birthDate // Changed from admin.birth to admin.birthDate
        }
        const token = signToken(adminData)
        res.status(200).json({token: token});

    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const createAdmin = async (req, res) => {
    try {
        const {firstName, lastName, email, birthDate, gender, password} = req.body;
        
        // Check if admin with same email already exists
        const existingAdmin = await Admin.findOne({where: {email}});
        if (existingAdmin) {
            return res.status(400).json({message: 'Admin with this email already exists'});
        }
        
        const data = {
            firstName,
            lastName,
            email,
            birthDate,
            gender,
            password: hashPassword(password),
        }
        const admin = await Admin.create(data);
        
        // Remove password from response
        const {password: _, ...adminResponse} = admin.toJSON();
        res.status(201).json({admin: adminResponse});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const updateAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        
        // Check if admin exists
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({message: 'Admin not found'});
        }
        
        // If password is being updated, hash it
        if (req.body.password) {
            req.body.password = hashPassword(req.body.password);
        }
        
        // Update admin
        await Admin.update(req.body, {where: {id}});
        
        // Get updated admin
        const updatedAdmin = await Admin.findByPk(id);
        const {password: _, ...adminResponse} = updatedAdmin.toJSON();
        
        res.status(200).json({
            message: 'Admin updated successfully',
            admin: adminResponse
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({message: 'Admin not found'});
        }
        
        await Admin.destroy({where: {id}}); // Changed from findByIdAndDelete
        
        res.status(200).json({
            message: 'Admin deleted successfully',
            deletedAdmin: {
                id: admin.id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const logoutAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({message: 'Admin not found'});
        }
        res.status(200).json({message: 'Logout successful'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

module.exports = {
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
    logoutAdmin
}