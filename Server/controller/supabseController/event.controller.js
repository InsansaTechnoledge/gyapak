// controllers/eventController.js
import {
  createEvent,
  assignSubjectsToEvent,
  assignQuestionsToEvent,
  getFullEventDetails,
  updateEventStatus,
  deleteEvent,
  getEventsbyExam
} from '../../Utility/SQL-Queries/event.query.js';

import { APIError } from '../../Utility/ApiError.js';
import { APIResponse } from '../../Utility/ApiResponse.js';
import { TestAttemptRecordModel } from '../../models/TestAttemptRecord.model.js';

export const createEventController = async (req, res) => {
  try {
    console.log("📥 Incoming request:", req.body); // 👈 log here
    const data = await createEvent(req.body);
    console.log("✅ Event created:", data);         // 👈 log here
    return new APIResponse(201, data, "Event created successfully").send(res);
  } catch (error) {
    console.error("❌ Error in createEventController:", error); // 👈 show full error
    return new APIError(500, [error?.message || "Unknown", "Failed to create event"]).send(res);
  }
};


export const assignSubjectsToEventController = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { subject_ids } = req.body; // [subject_id1, subject_id2]

    const data = await assignSubjectsToEvent(event_id, subject_ids);
    return new APIResponse(200, data, "Subjects assigned to event").send(res);
  } catch (error) {
    return new APIError(500, [error.message, "Failed to assign subjects"]).send(res);
  }
};

export const assignQuestionsToEventController = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { questions } = req.body;

    const data = await assignQuestionsToEvent(event_id, questions);
    return new APIResponse(200, data, "Questions assigned to event").send(res);
  } catch (error) {
    return new APIError(500, [error.message, "Failed to assign questions"]).send(res);
  }
};

export const getFullEventDetailsController = async (req, res) => {
  try {
    const { event_id } = req.params;
    const data = await getFullEventDetails(event_id);
    return new APIResponse(200, data, "Fetched event with full details").send(res);
  } catch (error) {
    return new APIError(500, [error.message, "Failed to fetch event details"]).send(res);
  }
};

export const updateEventStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await updateEventStatus(id, status);
    return new APIResponse(200, data, "Event status updated").send(res);
  } catch (error) {
    return new APIError(500, [error.message, "Failed to update status"]).send(res);
  }
};

export const deleteEventController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await deleteEvent(id);
    return new APIResponse(200, data, "Event deleted successfully").send(res);
  } catch (error) {
    return new APIError(500, [error.message, "Failed to delete event"]).send(res);
  }
};

export const getEventsForExamController = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const events = await getEventsbyExam(exam_id);
    return new APIResponse(200, events, "Events fetched for exam").send(res);
  } catch (e) {
    return new APIError(500, [e.message, "Failed to fetch events"]).send(res);
  }
};

export const getEventAttemptsByUser = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const attempts = await TestAttemptRecordModel.findOne({
      userId: userId,
      eventId: eventId
    })

    if(attempts){
      return new APIResponse(200, attempts, "Attempts fetched").send(res);
    }
    else{
      return new APIResponse(200, {attempts: 0}).send(res);
    }
  }
  catch (err) {
    return new APIError(500, [err.message, "Failed to fetch attempts"]).send(res);
  }
}

export const deleteEventAttemptsByUser = async (req,res) => {
  try{
    const {eventId, userId} = req.body;
    console.log(req.body);
    const attempts = await TestAttemptRecordModel.findOneAndDelete({
      userId,
      eventId
    });

    console.log(attempts);
    
    if(attempts){
      return new APIResponse(200, attempts, "Attempts deleted").send(res);
    }
    else{
      return new APIError(404, ['No Attempts']).send(res);
    }

  }
  catch(err){
    return new APIError(500, [err.message, "Failed to delete"]).send(res);
  }
}

export const incrementEventAttemptsByUser = async (req,res) => {
  try{
    const userId = req.user._id;
    const {eventId} = req.body;
    const newAttempts = await TestAttemptRecordModel.findOneAndUpdate(
      { userId, eventId },
      { $inc: { attempts: 1 } },
      { new: true, upsert: true }
    );

    if(newAttempts){
      return new APIResponse(200, newAttempts, "Attempts updated").send(res);
    }
    else{
      return new APIError(400, ["Bad Request"])
    }
  }
  catch(err){
    return new APIError(500, [err.message, "Failed to delete"]).send(res);
  }
}


