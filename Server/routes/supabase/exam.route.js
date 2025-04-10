// routes/exam.js
import express from 'express';
import {
  createExamController,
  addSubjectsToExamController,
  getExamWithSubjectsController,
  updateExamController,
  deleteExamController
} from '../../controller/supabseController/exam.controller.js';

const router = express.Router();

router.post('/', createExamController);
router.post('/:exam_id/subjects', addSubjectsToExamController);
router.get('/:id', getExamWithSubjectsController);
router.put('/:id', updateExamController);
router.delete('/:id', deleteExamController);

export default router;
