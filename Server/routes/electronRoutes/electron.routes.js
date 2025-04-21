import express from 'express';
// import { launchProctor } from '../controllers/proctor.controller.js';
import { launchProctor } from '../../controller/electron/electron.controller.js';

const router = express.Router();

router.post('/launch', launchProctor);

export default router;
