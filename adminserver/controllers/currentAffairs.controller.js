import { APIError } from "../../Server/Utility/ApiError.js"
import { APIResponse } from "../../Server/Utility/ApiResponse.js";
import { CurrentAffair } from "../models/currentAffairs.models.js";
import { mongoose } from "mongoose";

export const uploadCurrentAffair = async (req, res) => {
    try {
      const { date, affairs } = req.body;
  
      const affairDate = new Date(date);
      const month = affairDate.getMonth() + 1;
      const year = affairDate.getFullYear();
  
      // ✅ Print incoming affairs for debugging
      console.log("📥 Received Affairs:", JSON.stringify(affairs, null, 2));
  
      const exists = await CurrentAffair.findOne({ date: affairDate });
      if (exists) {
        return new APIError(400, ['Current affair already exists for this date']).send(res);
      }
  
      const newRecord = await CurrentAffair.create({
        date: affairDate,
        month,
        year,
        affairs
      });
  
      return new APIResponse(200, newRecord, 'New affair created successfully').send(res);
    } catch (e) {
      console.error("❌ Mongoose Validation Error:", e);
      return new APIError(500, [e.message, 'There was an error uploading current affairs']).send(res);
    }
  };
  

export const updateCurrentAffair = async (req , res) => {
    try{
        const id = req.params.id;

        if(! mongoose.Types.ObjectId.isValid(id)) return APIError(400, 'Id not valide').send(res);

        const updated = await CurrentAffair.findByIdAndUpdate(
            id,
            {
                ...req.body,
            },
            {new : true}
        )

        if(!updated) return new APIError(400, 'RECORD not found').send(res);

        return new APIResponse(200, updated , 'updated successfully').send(res);


    }  catch (e) {
        console.error("❌ Update Current Affair Error:", e);
        return new APIError(500, [e?.message || 'Error occurred while updating']).send(res);
      }
      
}

// controller/affair.controller.js
export const fetchAllCurrentAffairs = async (req, res) => {
    try {
      const all = await CurrentAffair.find({}).sort({ date: -1 });
      return new APIResponse(200, all, 'Fetched all current affairs').send(res);
    } catch (e) {
      console.error("❌ Error fetching affairs:", e);
      return new APIError(500, [e.message || 'Failed to fetch current affairs']).send(res);
    }
  };

  
  // controller/affair.controller.js
export const deleteCurrentAffair = async (req, res) => {
    try {
      const id = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(id))
        return new APIError(400, ['Invalid ID']).send(res);
  
      const deleted = await CurrentAffair.findByIdAndDelete(id);
  
      if (!deleted) {
        return new APIError(404, ['Record not found']).send(res);
      }
  
      return new APIResponse(200, deleted, 'Deleted successfully').send(res);
    } catch (e) {
      console.error("❌ Error deleting affair:", e);
      return new APIError(500, [e.message || 'Failed to delete record']).send(res);
    }
  };
  
  export const fetchTodaysCurrentAffairs = async (req, res) => {
    try {
      const today = new Date(); // Now
      today.setHours(0, 0, 0, 0); // Start of today
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Start of tomorrow
  
      console.log("🟨 Date range:", {
        today: today.toISOString(),
        tomorrow: tomorrow.toISOString()
      });
  
      const records = await CurrentAffair.find({
        date: { $gte: today, $lt: tomorrow }
      });
  
      console.log("📦 Found records:", records.length);
  
      return new APIResponse(200, records, "Fetched today's current affairs").send(res);
    } catch (e) {
      console.error("❌ Fetch error", e);
      return new APIError(500, [e.message]).send(res);
    }
  };
  

  
  export const fetchMonthlyCurrentAffairs = async (req, res) => {
    const { month, year } = req.query;
  
    try {
      const records = await CurrentAffair.find({
        month: Number(month),
        year: Number(year)
      }).sort({ date: -1 });
  
      return new APIResponse(200, records, "Fetched monthly current affairs").send(res);
    } catch (e) {
      return new APIError(500, [e.message || "Error fetching monthly data"]).send(res);
    }
  };
  
  export const fetchYearlyCurrentAffairs = async (req, res) => {
    const { year } = req.query;
  
    try {
      const records = await CurrentAffair.find({
        year: Number(year)
      }).sort({ date: -1 });
  
      return new APIResponse(200, records, "Fetched yearly current affairs").send(res);
    } catch (e) {
      return new APIError(500, [e.message || "Error fetching yearly data"]).send(res);
    }
  };
  

  export const addQuestionsToAffair = async (req, res) => {
    try {
        const { date, affairs } = req.body;
    
        const affairDate = new Date(date);
        const month = affairDate.getMonth() + 1;
        const year = affairDate.getFullYear();
    
        const exists = await CurrentAffair.findOne({ date: affairDate });
        if (exists) {
          return new APIError(400, ['Current affair already exists for this date']).send(res); 
        }
    
        const newRecord = await CurrentAffair.create({
          date: affairDate,
          month,
          year,
          affairs // ✅ this must include questions
        });
    
        return new APIResponse(200, newRecord, 'New affair created successfully').send(res);
      } catch (e) {
        return new APIError(500, [e.message, 'There was an error uploading current affairs']).send(res);
      }
  };
  

  export const getAffairWithQuestions = async (req, res) => {
    try {
      const { date, slug } = req.params;
  
      const record = await CurrentAffair.findOne({ date: new Date(date) });
  
      if (!record) return new APIError(404, ['No record found for given date']).send(res);
  
      const affair = record.affairs.find(
        a => a.title.toLowerCase().replace(/\s+/g, '-') === slug
      );
  
      if (!affair) return new APIError(404, ['Affair not found']).send(res);
  
      return new APIResponse(200, affair, 'Affair found').send(res);
    } catch (e) {
      return new APIError(500, [e.message, 'Failed to fetch affair']).send(res);
    }
  };