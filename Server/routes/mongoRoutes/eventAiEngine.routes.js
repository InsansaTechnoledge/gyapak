import express from 'express'
import { receiveProctorEvent } from '../../controller/mongoController/eventAiEngine.controller.js'

const router = express.Router();

router.post('/emit-event', receiveProctorEvent);

export default router;