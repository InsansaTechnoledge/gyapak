import express from "express"
import { getAllResults } from "../controller/resultController.js";

const router = express.Router();

router.get('/', getAllResults);


export default router;