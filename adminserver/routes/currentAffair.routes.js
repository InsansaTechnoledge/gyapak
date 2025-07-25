import express from 'express';

import { uploadCurrentAffair , updateCurrentAffair , fetchAllCurrentAffairs , deleteCurrentAffair , fetchTodaysCurrentAffairs , fetchMonthlyCurrentAffairs , fetchYearlyCurrentAffairs , getAffairWithQuestions} from '../controllers/currentAffairs.controller.js';

const router = express.Router()

router.post('/upload', uploadCurrentAffair);
router.put('/update/:id', updateCurrentAffair);
router.get('/all', fetchAllCurrentAffairs);
router.delete('/delete/:id', deleteCurrentAffair);
router.get('/today', fetchTodaysCurrentAffairs);
router.get('/month', fetchMonthlyCurrentAffairs);
router.get('/year', fetchYearlyCurrentAffairs);
router.get('/single/:date/:slug', getAffairWithQuestions);


export default router;
