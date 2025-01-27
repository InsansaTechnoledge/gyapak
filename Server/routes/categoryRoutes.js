import express from 'express';
import { getCategories, getCategory, getCategoryOrganizations } from '../controller/categoryController.js';

const router = express.Router();

router.get('/getCategories', getCategories);
router.get('/:name', getCategory);
router.get('/organizations/:category', getCategoryOrganizations);

export default router;
