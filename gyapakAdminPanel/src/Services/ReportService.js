import { API_BASE_URL } from "../config";
import axios from "axios";

export const getWeeklyReport = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/v1i2/reports/weekly`, {
    withCredentials: true,
  });
  return response.data;
}