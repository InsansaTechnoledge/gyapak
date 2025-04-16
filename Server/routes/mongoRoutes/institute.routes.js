import express from 'express';
import { createInstitute, deleteInstitute, getAllInstitute, getInstituteById, loginInstitue, updateInstitute } from '../../controller/mongoController/institute.controller.js';
import { authenticateInstituteMiddleware } from '../../middleware/passport.middleware.js';

const router = express.Router();

router.post('/', createInstitute);
router.get('/', getAllInstitute);
router.post('/login', authenticateInstituteMiddleware, loginInstitue);
router.get('/:id', getInstituteById);
router.put('/:id', updateInstitute);
router.delete('/:id', deleteInstitute);

export default router