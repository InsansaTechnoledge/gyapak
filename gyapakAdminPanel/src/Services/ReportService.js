import { API_BASE_URL } from "../config";
import axios from "axios";

export const getReportService = async (period) => {
  const response = await axios.get(`${API_BASE_URL}/api/v1i2/reports?period=${period}`, {
    withCredentials: true,
  });
  return response.data;
};

export const downloadPDFService = async (period) => {
  const response = await axios.get(`${API_BASE_URL}/api/v1i2/reports/download/pdf?period=${period}`, {
    withCredentials: true,
    responseType: 'blob',
  });
  return response.data;
};

export const downloadExcelService = async (period) => {
  const response = await axios.get(`${API_BASE_URL}/api/v1i2/reports/download/excel?period=${period}`, {
    withCredentials: true,
    responseType: 'blob',
  });
  return response.data;
};



