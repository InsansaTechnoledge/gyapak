import express from "express";
import { CreateCategory } from "../controller/categoryController.js";

const router = express.Router();

router.post('/createCategory', CreateCategory);

export default router;