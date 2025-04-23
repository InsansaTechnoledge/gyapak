import express from 'express'
import { checkUsersAnswers, getResultForEvent, getResultsByUser, getWrongQuestionsSubjectwiseForExam } from '../../controller/supabseController/testResult.controller.js'

const router = express.Router()

router.post('/check-answers' , checkUsersAnswers)
router.post('/wrong-subjectwise', getWrongQuestionsSubjectwiseForExam);
router.get('/results/event/:eventId', getResultForEvent);
router.get('/results/:examId', getResultsByUser);

export default router