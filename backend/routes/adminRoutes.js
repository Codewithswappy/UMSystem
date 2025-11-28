import express from 'express';
import {
    getAdminProfile,
    updateAdminProfile,
    changePassword,
    deleteAdminAccount,
    getAllAdmins,
    createAdmin
} from '../controllers/adminController.js';

const router = express.Router();

// Admin routes
router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.get('/:id', getAdminProfile);
router.put('/:id', updateAdminProfile);
router.put('/:id/password', changePassword);
router.delete('/:id', deleteAdminAccount);

export default router;
