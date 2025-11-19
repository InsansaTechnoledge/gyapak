import {CurrentAffair} from "../models/currentAffairs.models.js"
import generatePdf from "../Utility/magazineUtils/generatePdf.js"

export const generateMagazine = async (req, res) => {
  try {

    const {month, year} = req.query;

    if(!month && !year){
        return res.status(400).json({message:'check the passed query'});
    }

    const currentAffairsDocs  = await CurrentAffair.find({month, year});

    
    if(!currentAffairsDocs.length){
      return res.status(404).json({ message: 'No Current affairs found for this month/year' });
    }
    

    const allCurrentAffairs = currentAffairsDocs.flatMap((doc)=>({
      affair: doc.affairs,
      publishedDate: doc.date,
      month:doc.month,
      year:doc.year
    }));
    

    // if required i can format in custom data structure 

    const pdfBuffer = await generatePdf(allCurrentAffairs); // it will return the generated pdf of passed year and month
    
    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).json({ error: "Failed to generate PDF" });
    }

    
     res.writeHead(200,{
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=Weekly_Magazine.pdf",
      "Content-Length": pdfBuffer.length,
    });

    return res.end(pdfBuffer);
  } catch (error) {
    console.error('generateMagazine error:', error);
    return res.status(500).json({ message: 'Failed to generate PDF', error: String(error) });
  }
};