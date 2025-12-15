import { DailyCurrentAffairPdf } from "../models/DailyCurrentAfairPdf.js";


export const publishScheduledPdfs = async () => {
  try {
    const now = new Date();
    
    const result = await DailyCurrentAffairPdf.updateMany(
      {
        isScheduled: true,
        isPublished: false,
        scheduledPublishDate: { $lte: now }
      },
      {
        $set: { isPublished: true }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Published ${result.modifiedCount} scheduled PDF(s) at ${now.toISOString()}`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error in publishScheduledPdfs job:', error);
    throw error;
  }
};

export default publishScheduledPdfs;