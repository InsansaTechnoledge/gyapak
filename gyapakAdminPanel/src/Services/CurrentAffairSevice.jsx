import axios from "axios";

import { API_BASE_URL } from "../config";

export const createNewPdf = async (dailyData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/api/v1i2/affair/upload-pdf`, dailyData)
        return response
    }catch(error){
        console.error('Error uploading pdf:', error);
        throw error;
    }
}   

export const fetchpdfs = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/api/v1i2/affair/get-pdf`)
        return response.data
    } catch(error) {
        throw error
    }
}

export const deletePdf = async (id) => {
    return axios.delete(`${API_BASE_URL}/api/v1i2/affair/delete-pdf`, {
      data: { id },                       
      headers: { 'Content-Type': 'application/json' },
    });
  };
  