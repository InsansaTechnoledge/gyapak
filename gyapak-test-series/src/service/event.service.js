import api from './api.js'

// create new event
export const createEvent = async (eventData) => {
    const res = await api.post('/api/v1i2/event' , eventData)
    return res.data;
}

// assign subjects to an event
export const assignSubjectsToEvent = async (eventId , subjectIds) => {
    const res = await api.post(`/api/v1i2/event/${eventId}/subject` , {subject_ids: subjectIds}) 
    return res.data;
}

// Assign questions to an event
export const assignQuestionsToEvent = async (eventId , questions) => {
    const res = await api.post(`api/v1i2/event/${eventId}/question` , {questions})
    return res.data;
}

//get full event detail
export const getEventDetails = async (eventId) => {
    const res = await api.get(`api/v1i2/event/${eventId}`)
    return res.data;
}

// Delete event by ID
export const deleteEvent = async (eventId) => {
    const res = await api.delete(`api/v1i2/event/${eventId}`);
    return res.data;
};

// Update event status
export const updateEventStatus = async (eventId, status) => {
    const res = await api.put(`api/v1i2/event/${eventId}/status`, { status });
    return res.data;
};

export const getEventsByExamId = async (exam_id) => {
    const res = await api.get(`/api/v1i2/event/by-exam/${exam_id}`);
    return res.data;
  };

export const getFullEventDetails = async (event_id) => {
    const res = await (api.get(`/api/v1i2/event/${event_id}`));
    return res.data;
}