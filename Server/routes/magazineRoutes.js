import express from 'express'
import { generateMagazine } from '../controller/magazineController.js';

const router = express.Router();


router.get('/generate', generateMagazine);


export default router;