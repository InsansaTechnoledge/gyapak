import express from 'express';
import { createQuestions, deleteQuestions, getQuestionsBySubject, updateQuestions, uploadCSVQuestions , evaluateAnswersController, getQuestionbyEventid } from '../../controller/supabseController/question.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/evaluate', evaluateAnswersController);
// router.post('/csv-upload/:id' ,upload.single('file'), uploadCSVQuestions)
router.post(
    '/upload-csv/:subject_id/event/:event_id',
    upload.single('file'),
    uploadCSVQuestions
  );
router.post('/new-question', createQuestions)
router.get('/get-question-by-subject/:id' , getQuestionsBySubject)
router.get('/get-question-by-event/:id', getQuestionbyEventid)
router.patch('/:id' , updateQuestions)
router.delete('/:id' , deleteQuestions)

export default router;