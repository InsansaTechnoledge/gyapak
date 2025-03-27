import express from 'express'
import { getCentralOrganization } from '../controllers/organization.controller.js';

const router = express.Router();

router.get('/central-organizations', getCentralOrganization);

export default router;