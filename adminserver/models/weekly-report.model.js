import mongoose from "mongoose";

const WeeklyReportSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ["weekly-expiry-report"],
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  downloadCount: {
    type: Number,
  },
});

const WeeklyReport = mongoose.model("WeeklyReport", WeeklyReportSchema);
export default WeeklyReport;
