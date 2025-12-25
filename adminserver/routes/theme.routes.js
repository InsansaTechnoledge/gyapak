import express from 'express'
import { ActivateTheme, DeleteTheme, GetActiveTheme, ListAllThemes, PostThemes, UpsertTheme } from '../controllers/Theme.controller.js';

const router = express.Router();

router.get('/active', GetActiveTheme);
router.post('/upload-theme', PostThemes)
router.get('/', ListAllThemes);
router.put('/:slug', UpsertTheme);
router.patch('/:id/activate', ActivateTheme);
router.delete('/:id', DeleteTheme)

export default router;