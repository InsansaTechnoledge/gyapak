import express from 'express'
import { search, searchState, searchSuggestion } from '../controller/searchController.js';

const router = express.Router();

router.get('/result/:query', search );
router.get('/', searchSuggestion );
router.get('/state',searchState);

export default router;