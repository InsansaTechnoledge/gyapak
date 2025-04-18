import ProctorEvent from "../../models/eventsAiEngine.Model.js"

export const receiveProctorEvent = async (req, res) => {
    try {
      console.log("🟢 Received payload from C++ Engine:", req.body); // Already parsed object
  
      const { userId, examId, eventType, timestamp, details } = req.body;
  
      if (!userId || !examId || !eventType || !timestamp || !details) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const savedEvent = await ProctorEvent.create({
        userId,
        examId,
        eventType,
        timestamp,
        details,
      });
  
      console.log("✅ Event saved:", savedEvent);
  
      return res.status(201).json({ message: 'Event saved successfully', event: savedEvent });
    } catch (error) {
      console.error('❌ Error saving proctor event:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  