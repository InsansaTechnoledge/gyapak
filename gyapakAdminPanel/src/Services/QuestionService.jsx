import axiosInstance from "../api/axiosConfig";

export const createQuestionService = async (questionData, totalTime) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1i2/question?time=${totalTime}`,
      questionData
    );
    return response;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

export const updateQuestionService = async (
  questionId,
  questionData,
  totalTime
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1i2/question/${questionId}?time=${totalTime}`,
      questionData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const deleteQuestionService = async (questionId, totalTime) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1i2/question/${questionId}?time=${totalTime}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

export const reuseQuestionService = async (questionId, totalTime) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1i2/question/${questionId}/reuse?time=${totalTime}`
    );
    return response.data;
  } catch (error) {
    console.error("Error reusing question:", error);
    throw error;
  }
};
export const fetchQuestionsService = async (params) => {
  try {
    const response = await axiosInstance.get("/api/v1i2/question", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
