import express from 'express';
import { createInstitute, deleteInstitute, getAllInstitute, getCurrentLoggedInInstitiute, getInstituteById, loginInstitue, updateInstitute , logoutInstitute } from '../../controller/mongoController/institute.controller.js';
import { authenticateInstituteMiddleware } from '../../middleware/passport.middleware.js';
import { isInstituteAuthenticated } from '../../middleware/isLoggedIn.middleware.js';

const router = express.Router();

router.post('/', createInstitute);
router.get('/', getAllInstitute);
router.get('/institute-fetched' , isInstituteAuthenticated , getCurrentLoggedInInstitiute)
router.get('/logout', logoutInstitute);

router.post('/login', authenticateInstituteMiddleware, loginInstitue);
router.get('/:id', getInstituteById);
router.put('/:id', updateInstitute);
router.delete('/:id', deleteInstitute);

export default router