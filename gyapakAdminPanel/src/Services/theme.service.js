import axios from "axios";

export const getActiveTheme = async (apiBaseUrl) => {
  const { data } = await axios.get(`${apiBaseUrl}/api/theme/active`);
  return data; // { success, theme }
};

export const listThemes = async (apiBaseUrl) => {
  const { data } = await axios.get(`${apiBaseUrl}/api/theme`);
  return data; // { success, themes }
};

export const upsertTheme = async (apiBaseUrl, slug, payload) => {
  const { data } = await axios.put(`${apiBaseUrl}/api/theme/${slug}`, payload);
  return data; // { success, theme }
};

export const activateTheme = async (apiBaseUrl, id) => {
  const { data } = await axios.patch(`${apiBaseUrl}/api/theme/${id}/activate`);
  return data; // { success, theme }
};

export const deleteTheme = async (apiBaseUrl, id) => {
  const { data } = await axios.delete(`${apiBaseUrl}/api/theme/${id}`);
  return data; // { success: true }
};

// (optional) create theme (POST)
export const createTheme = async (apiBaseUrl, payload) => {
  const { data } = await axios.post(`${apiBaseUrl}/api/theme`, payload);
  return data;
};
