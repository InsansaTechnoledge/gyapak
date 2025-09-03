import express from 'express';
import { getTodaysQuestions } from '../controller/questionController.js';


const router = express.Router();

router.get('/',getTodaysQuestions);

export default router;
