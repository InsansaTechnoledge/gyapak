import express from 'express'
import { getCentralOrganization, getOrganizationsByState } from '../controllers/organization.controller.js';

const router = express.Router();

router.get('/central', getCentralOrganization);
router.get('/state', getOrganizationsByState);

export default router;