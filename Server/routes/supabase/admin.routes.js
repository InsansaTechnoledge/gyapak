import express from 'express'
import { createFullExamSetup } from '../../controller/supabseController/admin.coontroller.js';

const router = express.Router()

router.post('/full-setup', createFullExamSetup);


export default router