import Event from "../models/EventModel.js";
import EventType from "../models/EventTypeModel.js";
import Organization from "../models/OrganizationModel.js";

export const getEvent = async (req, res) => {
    try {
  
      const { eventId } = req.params;
  
      const exam = await Event.findOne({
        _id:eventId}
      );
    
      if(!exam){
        return res.status(404).json({message: "Event not found"});
      }

      const organizationId = exam.organization_id;
  
      const organization = await Organization.findOne({_id: organizationId});
  
      // Return the exam
      res.status(200).json({exam,organization});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const updateEvent = async (req,res) => {
    try{

        const {id} = req.params;
        const event = req.body;
        const { _id, __v, createdAt, updatedAt, ...cleanEvent } = event;

        const newEvent = await Event.findByIdAndUpdate(id,cleanEvent,{
            new: true
        });
        
        if(newEvent){
            res.status(200).json({newEvent, message: "Event updated"});
        }
        else{
            res.status(404).json({message:"Event not found"});
        }
    }
    catch(e){
        return res.status(500).json({message: e.message});
    }

}


export const deleteEvent = async (req, res) => {
    const { organizationId, eventId } = req.body;
    try {
        const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const event_type = event.event_type;
        console.log(event_type);
        const [updatedOrganization, updatedEventType] = await Promise.all([
            Organization.findByIdAndUpdate(
                organizationId,
                { $pull: { events: eventId } },
                { new: true }
            ),
            EventType.findOneAndUpdate(
                { type: event_type },
                { $pull: { events: eventId } },
                { new: true }
            )
        ]);

        res.status(200).json({
            message: "Event deleted successfully",
            updatedOrganization,
            updatedEventType
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
} 