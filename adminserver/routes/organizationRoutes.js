import express from 'express'
import { getCentralOrganization, getOrganizationsByState, getAllOrganizations } from '../controllers/organization.controller.js';

const router = express.Router();

router.get('/central', getCentralOrganization);
router.get('/state', getOrganizationsByState);
router.get('/', getAllOrganizations);

export default router;