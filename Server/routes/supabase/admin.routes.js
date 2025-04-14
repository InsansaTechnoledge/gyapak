import express from 'express'
import { createFullExamSetup } from '../../controller/supabseController/admin.controller.js';

const router = express.Router()

router.post('/full-setup', createFullExamSetup);


export default router