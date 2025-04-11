import express from 'express'
import { checkUsersAnswers, getWrongQuestionsSubjectwiseForExam } from '../../controller/supabseController/testResult.controller.js'

const router = express.Router()

router.post('/check-answers' , checkUsersAnswers)
router.post('/wrong-subjectwise', getWrongQuestionsSubjectwiseForExam);

export default router