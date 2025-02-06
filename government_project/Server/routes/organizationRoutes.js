import express from 'express';
import { createOrganizations, updateOrganization, updateOrganizationCategory } from '../controller/organizationController.js';

const router=express.Router();

router.post('/createOrganizations',createOrganizations);
router.post('/updateOrganization',updateOrganization);
router.post('/updateOrganizationCategory',updateOrganizationCategory);

export default router;