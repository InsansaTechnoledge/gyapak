import express from 'express';
import { CreateSubject, DeleteSubject, GetAllSubjects, UpdateSubject , GetSubjectsByEvent } from '../../controller/supabseController/subject.controller.js';

const router = express.Router();

router.post('/new-subject' , CreateSubject);
router.get('/all-subjects' , GetAllSubjects);
router.get('/by-event/:event_id', GetSubjectsByEvent);
router.patch('/update-subject/:id' , UpdateSubject);
router.delete('/delete-subject/:id' , DeleteSubject)

export default router;
