import Category from "../models/CategoryModel.js";
import {CurrentAffair} from "../models/currentAffairs.models.js"
import Event from "../models/EventModel.js"
import generateVacenciesPdf from "../Utility/magazineUtils/allVacancies/generatePdf.js"
import generateMagazinePdf from "../Utility/magazineUtils/currentAffairs/generatePdf.js"

//for current affairs
export const generateMagazine = async (req, res) => {
  try {

    const {month, year} = req.query;

    if(!month && !year){
        return res.status(400).json({success:false, message:'check the passed query'});
    }

    const currentAffairsDocs  = await CurrentAffair.find({month, year});
   //i can use here aggirgation also, but with this filter it works

    
    if(!currentAffairsDocs.length){
      return res.status(404).json({success:false, message: 'No Current affairs found for this month/year' });
    }
    

    const allCurrentAffairs = currentAffairsDocs.flatMap((doc)=>({
      affair: doc.affairs,
      publishedDate: doc.date,
      month:doc.month,
      year:doc.year
    }));
    

    // if required i can format in custom data structure 

    const pdfBuffer = await generateMagazinePdf(allCurrentAffairs);
    // await generateMagazinePdf(allCurrentAffairs); // it will return the generated pdf of passed year and month
    
    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).json({success:false, error: "Failed to generate PDF" });
    }
    
     res.writeHead(200,{
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=gyapak-${month-year}-Magazine.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    return res.end(pdfBuffer);
  } catch (error) {
    console.error('generateMagazine error:', error);
    return res.status(500).json({success:false, message: 'Failed to generate PDF', error: String(error) });
  }
};

//for vacencies
export const genarateVacencies = async (req, res)=>{
  try {
    const {categoryId, organizationId, type, range, year, month, week, from, to } = req.query;

    if(type!=='exam'){
      return res.status(400).json({message:"abhi type wala kaam karega"});
    }
    let fromDate, toDate ;


    if(range==='custom'){
      fromDate = new Date(from);
      toDate = new Date(to);
    }
    if (range === "week") {
    toDate = new Date();
    fromDate = new Date();
    fromDate.setDate(toDate.getDate() - Number(week));
    }

    if (range === "month") {
      toDate = new Date();
      fromDate = new Date();
      fromDate.setMonth(toDate.getMonth() - Number(month));
    }

    if (range === "year") {
      fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - Number(year));
      toDate = new Date();
    }

    
  
    let vacancies;

    if (organizationId === "all") {
      // console.log("all me aaya");
      const category = await Category.find({_id: categoryId}); //lean??

      const organizations =  category[0].organizations; // [] array of orgid

      vacancies = await Event.find({ organization_id:{$in: organizations},
         createdAt: { $gte: fromDate, $lte: toDate }}).populate("organization_id", "abbreviation").lean();

    } else {
      // fetch specific organization
      vacancies = await Event.find({
        organization_id: organizationId,
        createdAt: { $gte: fromDate, $lte: toDate }
      }).populate("organization_id", "abbreviation").lean(); // it besically prevent the get/set methods
      
    }


    if (!vacancies || vacancies.length === 0) {
      return res.status(404).json({success:false, message: "No vacancies found" });
    }

    vacancies = vacancies.map(v=>({
      ...v,
      organization_name:v.organization_id?.abbreviation
    }));


    const result = await generateVacenciesPdf(vacancies);
    // return res.status(500).json({ message: "PDF generation failed",vacancies});

    if (!result.success) {
      return res.status(500).json({success:false, message: "PDF generation failed", error: result.error });
    }

    const {pdfBuffer} = result;

     res.writeHead(200,{
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=gyapak-vaccencies-Magazine.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    return res.end(pdfBuffer);

  } catch (error) {
    console.log("PDF ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }

}