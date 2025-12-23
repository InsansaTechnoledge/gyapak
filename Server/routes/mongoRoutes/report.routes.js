import express from "express";
import fecthReport from "../../controller/mongoController/report.controller.js";
const router = express.Router();

router.get("/fetch", fecthReport);
router.get("/", (req, res) => {
  res.send("till report");
});
export default router;
