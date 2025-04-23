import api from './api';

// Submit answers for evaluation
export const checkUsersAnswers = async ( answers, userId, exam_id, event_id ) => {
  const res = await api.post('/api/v1i2/testresult/check-answers', {
    answers,
    userId,
    exam_id,
    event_id
  });
  return res.data;
};

// Fetch wrong questions subject-wise
export const getWrongQuestionsSubjectwiseForExam = async ({ examId, userId }) => {
  const res = await api.post('/api/v1i2/testresult/wrong-subjectwise', {
    examId,
    userId
  });
  return res.data;
};

export const getResultsByUser = async (examId) => {
  const res = await api.get(`/api/v1i2/testresult/results/${examId}`);
  return res.data;
}

export const getResultForEvent = async (eventId) => {
  const res = await api.get(`/api/v1i2/testresult/results/event/${eventId}`);
  return res.data;
}
