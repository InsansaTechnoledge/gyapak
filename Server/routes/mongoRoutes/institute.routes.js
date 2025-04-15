import express from 'express';
import { createInstitute, deleteInstitute, getAllInstitute, getInstituteById, updateInstitute } from '../../controller/mongoController/institute.controller.js';

const router = express.Router();

router.post('/', createInstitute);
router.get('/', getAllInstitute);
router.get('/:id', getInstituteById);
router.put('/:id', updateInstitute);
router.delete('/:id', deleteInstitute);

export default router