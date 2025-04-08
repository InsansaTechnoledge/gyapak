import Event from '../models/EventModel.js'
import Organization from '../models/OrganizationModel.js';
import EventType from '../models/EventTypeModel.js';

export const getLatestUpdates = async (req, res) => {
    try {
        // Calculate date range for last year
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear(), now.getMonth()-1, now.getDate());
        console.log(oneYearAgo);
        const exams = await Event.aggregate([
          {
            $match: {
              updatedAt: { $gte: oneYearAgo, $lte: now }
            }
          },
          {
            $lookup: {
              from: "organizations", // The name of the organization collection
              localField: "organization_id", // The field in the Event document that references the Organization
              foreignField: "_id", // The field in the Organization collection that is referenced (usually _id)
              as: "organizationDetails" // The field in the output that will contain the organization data
            }
          },
          {
            $unwind: "$organizationDetails" // To flatten the organizationDetails array into a single object
          },
          {
            $project: {
              _id: 1,
              name: 1, // Event name or other fields you want to include
              updatedAt: 1,
              apply_link: 1,
              organizationName: "$organizationDetails.abbreviation" // Including the organization name
            }
          }
        ]);
        
        res.status(201).json(exams);
      }
      catch(err){
        console.log(err);
      }
};


export const getEvent = async (req, res) => {
  try {

    const { eventId } = req.params;

    const exam = await Event.findOne({
      _id:eventId}
    );

    const organizationId = exam.organization_id;

    const organization = await Organization.findOne({_id: organizationId});

    // Return the exam
    res.status(200).json({exam,organization});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const lastupdated = async (req, res) => {
  try{
    const update=await EventType.findOne({type:"update"});
    if(!update){
      return res.status(201).json({data:new Date()});
    }
    res.status(201).json({data:update.lastUpdated});
  }catch(err){
    console.log("error occured in fetching last updated date:",err);
    res.status(400).json({message:"Error occured"});
  }
};
