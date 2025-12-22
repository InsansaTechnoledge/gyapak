import { QuickResultAdmitCard } from "../models/QuickResultAdmitCard.model.js";

export const AddResultAdmitCard = async (req, res) => {
    try{

        const { kind , title , link , description , resultDate , isTentative } = req.body;

        if(!kind , !title , !link , !description , !resultDate) {
            return res.status(400).json({
                message: 'All fields are required (except Tentative status)'
            })
        }

        const data = new QuickResultAdmitCard({
            kind,
            title,
            link,
            description,
            resultDate,
            isTentative
        })

        await data.save();

        res.status(201).json({
            message: 'Data added successfully',
            data
        })

    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong',
            error: e.message
        })
    }
}

export const GetsultResultsAdmitcards = async (req, res) => {
    try {
      const { kind } = req.query;
  
      const filter = kind ? { kind } : {};
  
      const data = await QuickResultAdmitCard.find(filter).sort({ createdAt: -1 });
  
      if(data.length === 0) {
        return res.status(404).json({
            message: kind
            ? "No result matching "+ kind + " found"
            : "No results found",
        })
      }
      
      return res.status(200).json({
        message: "Data fetched successfully",
        data,
      });
      
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong while fetching the results/admitcards",
        error: e.message,
      });
    }
};