import axiosInstance from "../api/axiosConfig";

export const createNewPdf = async (dailyData, totalTime) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1i2/affair/upload-pdf?time=${totalTime}`,
      dailyData
    );
    return response;
  } catch (error) {
    console.error("Error uploading pdf:", error);
    throw error;
  }
};

export const fetchpdfs = async () => {
  const response = await axiosInstance.get("/api/v1i2/affair/get-pdf");
  return response.data;
};

export const deletePdf = async (id, totalTime) => {
  return axiosInstance.delete(`/api/v1i2/affair/delete-pdf?time=${totalTime}`, {
    data: { id },
    headers: { "Content-Type": "application/json" },
  });
};
