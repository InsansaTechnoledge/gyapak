import express from 'express'
import { checkUsersAnswers } from '../../controller/supabseController/testResult.controller.js'

const router = express.Router()

router.post('/check-answers' , checkUsersAnswers)

export default router