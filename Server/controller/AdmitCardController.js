import EventType from '../models/EventTypeModel.js'
import Event from '../models/EventModel.js'

export const getAdmitCards = async (req,res) => {
    const admitCardType = await EventType.findOne({type: "AdmitCard"});

    const admitCardIds = admitCardType.events;
    const admitCards = await Event.aggregate([
        {
            $match: {
                _id: { $in: admitCardIds },
            },
        },
        {
            $lookup: {
                from: 'organizations', // The name of the organization collection
                localField: 'organization_id', // Field in the Event collection
                foreignField: '_id', // Field in the Organization collection
                as: 'organizationDetails', // The resulting array field
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
                organization_id: 1,
                apply_link:1,
                abbreviation: '$organizationDetails.abbreviation', // Include abbreviation
                category: '$categoryDetails.category', // Include category field
            },
        },
    ]);

    

    return res.status(201).json(admitCards);    
}