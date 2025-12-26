import axiosInstance from '../api/axiosConfig';

export const getWeeklyReport = async () => {
  const response = await axiosInstance.get('/api/v1i2/reports/weekly');
  return response.data;
}