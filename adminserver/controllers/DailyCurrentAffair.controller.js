// import { DailyCurrentAffairPdf } from "../models/DailyCurrentAffairPdf.js";

import { DailyCurrentAffairPdf } from "../models/DailyCurrentAfairPdf.js";

export const addNewPdf = async (req, res) => {
  try {
    const { date, pdfLink, title, category, description, tags } = req.body;

    if (!pdfLink || !date) {
      return res
        .status(400)
        .json({ message: "PDF link or date not provided for adding PDF." });
    }

    // Optional: prevent duplicate entry
    const existing = await DailyCurrentAffairPdf.findOne({ date });
    if (existing) {
      return res.status(409).json({ message: "PDF for this date already exists." });
    }

    const newPdf = new DailyCurrentAffairPdf({
      date,
      pdfLink,
      title,
      category,
      description,
      tags,
    });

    await newPdf.save();

    return res.status(201).json({
      message: "PDF uploaded successfully.",
      data: newPdf,
    });
  } catch (e) {
    console.error("Error adding PDF:", e);
    return res.status(500).json({ message: "Something went wrong while adding the PDF." , error: e });
  }
};

export const fetchPdf = async (req, res) => {
    try{

        const data = await DailyCurrentAffairPdf.find()
        return res.status(200).json({
            message: "fetched all the pdfs",
            data:data
        })

    } catch(e) {
        return res.status(500).json({message: "something went wrong while fetching pdf's"})
    }
}

export const deletePdfByID = async (req, res) => {
    try {
      const {id}  = req.body;

      console.log(id);
      
  
      if (!id) {
        return res
          .status(400)
          .json({ message: "PDF id not provided for deleting PDF." });
      }
  
      const deleted = await DailyCurrentAffairPdf.findByIdAndDelete(id); 
  
      if (!deleted) {
        return res.status(404).json({ message: "No PDF found with the given id." });
      }
  
      return res.status(200).json({
        message: "PDF deleted successfully",
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Something went wrong while deleting the PDF",
        error: e.message,
      });
    }
  };
  