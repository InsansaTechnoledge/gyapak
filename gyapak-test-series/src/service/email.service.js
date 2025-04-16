import api from "./api";

export const invoiceEmail = async (emailData) => {
        const res = await api.post("/api/v1i2/email/invoiceEmail", emailData);
        return res.data;
};