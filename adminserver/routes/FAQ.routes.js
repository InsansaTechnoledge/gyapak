import express from 'express';
import { getAllFAQs, getFAQsFromOrganization } from '../controllers/FAQ.controller.js';

const router = express.Router();

router.get('/', getAllFAQs);

// for Organization-specific page FAQs
router.get('/org/:orgId', getFAQsFromOrganization);

export default router;
