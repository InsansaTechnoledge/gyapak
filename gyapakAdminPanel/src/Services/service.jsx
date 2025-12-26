// services/adminBlog.service.js
import axiosInstance from "../api/axiosConfig";

export const createBlog = async (blogData) => {
  const response = await axiosInstance.post("/api/v1i2/blog", blogData);
  return response.data;
};

export const updateBlog = async (id, blogData) => {
  const response = await axiosInstance.put(`/api/v1i2/blog/${id}`, blogData);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await axiosInstance.delete(`/api/v1i2/blog/${id}`);
  return response.data;
};

export const getAllBlogsForAdmin = async () => {
  const response = await axiosInstance.get("/api/v1i2/blog");
  return response.data;
};

// export const uploadCurrentAffair = async ({ date, affairs }) => {
//   const payload = {
//     date,
//     affairs: affairs.map((a) => ({
//       ...a,
//       tags: Array.isArray(a.tags)
//         ? a.tags
//         : a.tags.split(',').map(tag => tag.trim()).filter(Boolean)
//     }))
//   };

//   const res = await axiosInstance.post('/api/v1i2/affair/upload', payload);
//   return res.data;
// };

export const uploadCurrentAffair = async ({ date, affairs, totalTime }) => {
  const formattedAffairs = affairs.map((a) => ({
    ...a,
    tags: Array.isArray(a.tags)
      ? a.tags
      : a.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    questions: a.questions || [], // ensure questions array is passed
  }));

  const payload = {
    date,
    month: new Date(date).getMonth() + 1,
    year: new Date(date).getFullYear(),
    affairs: formattedAffairs,
    totalTime,
  };

  const res = await axiosInstance.post(`/api/v1i2/affair/upload?time=${totalTime}`, payload);
  return res.data;
};

export const updateCurrentAffairById = async (id, payload, totalTime) => {
  const res = await axiosInstance.put(
    `/api/v1i2/affair/update/${id}?time=${totalTime}`,
    payload
  );
  return res.data;
};

export const fetchCurrentAffairs = async () => {
  const res = await axiosInstance.get("/api/v1i2/affair/all");
  return res.data;
};

export const deleteCurrentAffairById = async (id, totalTime) => {
  const res = await axiosInstance.delete(
    `/api/v1i2/affair/delete/${id}?time=${totalTime}`
  );
  return res.data;
};

// Event Management Services
export const fetchAllEvents = async () => {
  try {
    const res = await axiosInstance.get("/api/v1i2/event");
    console.log("Response received:", res.data);
    return res.data;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  const res = await axiosInstance.get(`/api/v1i2/event/${eventId}`);
  return res.data;
};

export const updateEventById = async (id, eventData) => {
  const res = await axiosInstance.post(`/api/v1i2/event/${id}`, eventData);
  return res.data;
};

export const deleteEventById = async (organizationId, eventId) => {
  const res = await axiosInstance.delete("/api/v1i2/event", {
    data: { organizationId, eventId },
  });
  return res.data;
};
