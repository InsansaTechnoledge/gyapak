import express from 'express';
import { CreateSubject, DeleteSubject, GetAllSubjects, UpdateSubject } from '../../controller/supabseController/subject.controller.js';

const router = express.Router();

router.post('/new-subject' , CreateSubject);
router.get('/all-subjects' , GetAllSubjects);
router.patch('/update-subject/:id' , UpdateSubject);
router.delete('/delete-subject/:id' , DeleteSubject)

export default router;
