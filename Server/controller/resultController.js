import Event from "../models/EventModel.js";
import EventType from "../models/EventTypeModel.js";

export const getAllResults = async (req, res) => {
    try{

        const ResultType = await EventType.findOne({type: "Result"});
        if(!ResultType){
            return res.status(201).json({'results':[]});
        }
        const ResultIds = ResultType.events;
        
        const results = await Event.aggregate([
            {
                $match: {
                    _id: { $in: ResultIds },
                },
            },
            {
                $lookup: {
                    from: 'organizations', // The name of the organization collection
                localField: 'organization_id', // Field in the Event collection
                foreignField: '_id', // Field in the Organization collection
                as: 'organizationDetails', 
            },
        },
        {
            $unwind: '$organizationDetails', // Flatten the organizationDetails array
        },
        {
            $lookup: {
                from: 'categories', // The name of the category collection
                localField: 'organizationDetails.category', // Field in the organization collection
                foreignField: '_id', // Field in the Category collection
                as: 'categoryDetails', // The resulting array field
            },
        },
        {
            $unwind: {
                path: '$categoryDetails', // Flatten the categoryDetails array
                preserveNullAndEmptyArrays: true, // Keep events even if no matching category is found
            },
        },
        {
            $project: {
                _id: 1, // Include event _id
                name: 1, // Include other fields from Event (example)
                date_of_notification: 1,
                end_date: 1,
                apply_link: 1,
                organization_id: 1,
                abbreviation: '$organizationDetails.abbreviation', // Include abbreviation
                category: '$categoryDetails.category', // Include category field
            },
        },
    ]);
    
    res.status(201).json(results);    
    }
    catch(err){
        console.log(err);
        res.json({'message':err})
    }
}