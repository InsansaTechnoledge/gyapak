import express from 'express';
import { createAuthority, updateLogos } from '../controller/authorityController.js';

const router=express.Router();
 
router.post('/createAuthority',createAuthority);
router.post('/updateLogos',updateLogos);

export default router;



