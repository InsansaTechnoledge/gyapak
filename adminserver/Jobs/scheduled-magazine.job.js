import { DailyCurrentAffairPdf } from "../models/DailyCurrentAfairPdf.js";
import mongoose from "mongoose";

// Prevent concurrent executions
let isProcessing = false;

export const publishScheduledPdfs = async () => {
  const jobStartTime = new Date();
  console.log(`[${jobStartTime.toISOString()}] 🔄 Starting publishScheduledPdfs job...`);

  // Prevent race conditions
  if (isProcessing) {
    console.log("⚠️  Job already running, skipping this execution");
    return { success: false, message: "Job already running", skipped: true };
  }

  isProcessing = true;

  try {
    // 1. Verify database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error(
        `Database not connected. ReadyState: ${mongoose.connection.readyState}`
      );
    }
    console.log("✅ Database connection verified");

    // 2. Use UTC time explicitly to avoid timezone issues
    const nowUTC = new Date();
    console.log(`📅 Current UTC time: ${nowUTC.toISOString()}`);
    console.log(`📅 Current local time: ${nowUTC.toString()}`);

    // 3. Find documents that need to be published (for logging)
    const documentsToPublish = await DailyCurrentAffairPdf.find({
      isScheduled: true,
      isPublished: false,
      scheduledPublishDate: { $lte: nowUTC },
    }).select("title scheduledPublishDate category");

    console.log(
      `📊 Found ${documentsToPublish.length} document(s) ready to publish`
    );

    if (documentsToPublish.length > 0) {
      console.log("📋 Documents to publish:");
      documentsToPublish.forEach((doc, index) => {
        console.log(
          `   ${index + 1}. "${doc.title}" (${doc.category}) - Scheduled for: ${doc.scheduledPublishDate.toISOString()}`
        );
      });
    }

    // 4. Update documents
    const result = await DailyCurrentAffairPdf.updateMany(
      {
        isScheduled: true,
        isPublished: false,
        scheduledPublishDate: { $lte: nowUTC },
      },
      {
        $set: { isPublished: true },
      }
    );

    // 5. Log detailed results
    const jobEndTime = new Date();
    const duration = jobEndTime - jobStartTime;

    console.log("📊 Update Result:", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      acknowledged: result.acknowledged,
    });

    if (result.modifiedCount > 0) {
      console.log(
        `✅ Successfully published ${result.modifiedCount} scheduled PDF(s) at ${nowUTC.toISOString()}`
      );
    } else if (documentsToPublish.length > 0 && result.modifiedCount === 0) {
      console.warn(
        `⚠️  Warning: Found ${documentsToPublish.length} documents but modified ${result.modifiedCount}. Possible race condition or update failure.`
      );
    } else {
      console.log("ℹ️  No scheduled PDFs ready to publish at this time");
    }

    console.log(`⏱️  Job completed in ${duration}ms`);

    isProcessing = false;

    return {
      success: true,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      timestamp: nowUTC.toISOString(),
      duration: `${duration}ms`,
    };
  } catch (error) {
    isProcessing = false;

    console.error("❌ Error in publishScheduledPdfs job:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Database state:", mongoose.connection.readyState);

    // Return error details instead of throwing
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      dbState: mongoose.connection.readyState,
      timestamp: new Date().toISOString(),
    };
  }
};

export default publishScheduledPdfs;
