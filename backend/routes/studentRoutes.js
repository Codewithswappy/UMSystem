import express from 'express';
import {
    getAllStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentStats
} from '../controllers/studentController.js';

import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/stats', getStudentStats);
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.put('/:id', upload.single('profilePicture'), updateStudent);
router.delete('/:id', deleteStudent);

export default router;
