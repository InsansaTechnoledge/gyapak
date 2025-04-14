import api from "./api";

export const createFullExamSetup = async (formData) => {
    const response = await api.post('/api/v1i2/admin/full-setup', formData);
    return response.data;
}