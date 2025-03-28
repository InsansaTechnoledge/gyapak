import Event from "../models/EventModel.js";
import EventType from "../models/EventTypeModel.js";
import Organization from "../models/OrganizationModel.js";

export const uploadEvent = async (req, res) => {
    try {
        console.log(req.body);
        const newEvent = await Event.create(req.body);
        console.log(req.body.event_type);
        // Execute updates concurrently
        await Promise.all([
            EventType.findOneAndUpdate(
                { type: req.body.event_type },
                {
                    $push: { events: newEvent._id },
                    $set: { lastUpdated: Date.now() }
                }
            ),
            Organization.findByIdAndUpdate(req.body.organization_id, {
                $push: { events: newEvent._id }
            })
        ]);

        return res.status(200).json({ message: 'Event uploaded successfully', event: newEvent });
    } catch (error) {
        // console.log('Error uploading event:', error);
        return res.status(500).json({ message: error.message });
    }
};
