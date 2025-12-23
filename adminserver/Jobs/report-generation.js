import generateReport from "../controllers/weeklyReport.controller.js";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import WeeklyReport from "../models/weekly-report.model.js";
// 🔐 Configure ONCE (not inside function)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const reportGenerationJob = async () => {
  console.log("📄 PDF generation started in cron");

  // 1️⃣ WAIT for PDF generation
  await generateReport();

  const filename = "Weekly_Events_Report.pdf";
  const pdfPath = path.join(process.cwd(), "public", "pdf", filename);

  // Safety check
  if (!fs.existsSync(pdfPath)) {
    throw new Error("PDF file not found after generation");
  }

  console.log("☁️ Uploading:", pdfPath);

  try {
    // 2️⃣ Upload & AUTO-REPLACE
    const result = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "raw",
      folder: "reports",
      public_id: "weekly_events_report", // 🔑 FIXED ID
      overwrite: true,
      invalidate: true,
      access_control: [
        {
          access_type: "anonymous",
        },
      ],
    });

    console.log("✅ Upload success");

    if (!result) return console.log("error in saving pdf in CDN");
    const updatedModel = await WeeklyReport.updateOne(
      {
        type: "weekly-expiry-report",
      },
      {
        $set: {
          pdfUrl: result.secure_url,
        },
      },
      {
        upsert: true,
      }
    );
    if (updatedModel) return console.log("✅pdf addded to DB");
  } catch (error) {
    console.error("❌ Upload failed", error);
  }
};

export default reportGenerationJob;
