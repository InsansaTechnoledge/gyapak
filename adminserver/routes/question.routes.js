import express from 'express'
import { createQuestion, deleteQuestion, editQuestion, getQuestionList, reuseQuestion } from '../controllers/question.controller.js';


const router = express.Router();

router.get('/', getQuestionList);
router.post('/', createQuestion);
router.patch('/:id', editQuestion);
router.delete('/:id', deleteQuestion);
router.post('/:id/reuse', reuseQuestion);

export default router;