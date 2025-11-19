import express from 'express'
import { generateMagazine, genarateVacencies } from '../controller/magazineController.js';

const router = express.Router();

//this can be changed as we scale for filteration
router.get('/generateMagazine', generateMagazine);
router.get('/generateVacencies', genarateVacencies); // for vacencies


export default router;