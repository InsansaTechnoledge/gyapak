import sendEmail from "../../Utility/emailUtils/emailConfig.js";
import { generatePaymentEmailTemplate } from "../../Utility/emailUtils/templates/invoice-email.js";
import { generateAccountCreationEmailTemplate } from "../../Utility/emailUtils/templates/newAccount-email.js";
import { generateForgotPasswordEmailTemplate } from "../../Utility/emailUtils/templates/ForgetPassword-email.js";
import { generateMockTestReminderEmailTemplate } from "../../Utility/emailUtils/templates/reminder-mail.js";
import { generateMockTestResultEmailTemplate } from "../../Utility/emailUtils/templates/result-mail.js";
import { generateNewTestSeriesEmailTemplate } from "../../Utility/emailUtils/templates/newTest-email.js";
import { APIResponse } from "../../Utility/ApiResponse.js";
import { APIError } from "../../Utility/ApiError.js";


export const sendInvoiceEmail = async (req,res) => {
    const {data,testName,payment}=req.body;
    try {
        const subject = `Invoice #${payment.receipt}`;
        const txt=generatePaymentEmailTemplate(data,testName,payment);
        await sendEmail(data.email, subject, txt);
        console.log("Invoice email sent successfully.");
        return new APIResponse(200, null, "Invoice email sent successfully").send(res);
    } catch (error) {
        console.error("Error sending invoice email:", error);
        return new APIError(500, [error.message]).send(res);
    }
};

export const forgetPasswordEmail = async (req,res) => {
    const {data, resetLink}=req.body;
    try {
        console.log("Data in forget password email:", data);
        const subject = "Password Reset Request";
        const txt = generateForgotPasswordEmailTemplate(data, resetLink);
        await sendEmail(data.email, subject, txt);
        console.log("Forget password email sent successfully.");
        return new APIResponse(200, null, "Forget password email sent successfully").send(res);
    } catch (error) {
        console.error("Error sending forget password email:", error);
        return new APIError(500, [error.message]).send(res);
    }
};

export const newAccountEmail = async (req,res) => {
    const {data}=req.body;
    try {
        const subject = "Welcome to Gyapak TestSeries!";
        const txt = generateAccountCreationEmailTemplate(data);
        await sendEmail(data.email, subject, txt);
        console.log("New account email sent successfully.");
        return new APIResponse(200, null, "New account email sent successfully").send(res);
    } catch (error) {
        console.error("Error sending new account email:", error);
        return new APIError(500, [error.message]).send(res);
    }
};

export const newTestSeriesEmail = async (req,res) => {
    const {data}=req.body;
    try {
        const subject = "New Test Series Available!";
        const txt = generateNewTestSeriesEmailTemplate(data);
        await sendEmail(data.email, subject, txt);
        console.log("New test series email sent successfully.");
        return new APIResponse(200, null, "New test series email sent successfully").send(res);
    } catch (error) {
        console.error("Error sending new test series email:", error);
        return new APIError(500, [error.message]).send(res);
    }
};

export const reminderEmail = async (req,res) => {
    const {data}=req.body;
    try {
        const subject = "Reminder: Upcoming Mock Test";
        const txt = generateMockTestReminderEmailTemplate(data);
        await sendEmail(data.email, subject, txt);
        console.log("Reminder email sent successfully.");
        return new APIResponse(200, null, "Reminder email sent successfully").send(res);
    } catch (error) {
        console.error("Error sending reminder email:", error);
        return new APIError(500, [error.message]).send(res);
    }
};

export const resultEmail = async (req,res) => {
    const {data}=req.body;
    try{
        const subject = "Your Mock Test Result";
        const txt = generateMockTestResultEmailTemplate(data);
        await sendEmail(data.email, subject, txt);
        console.log("Result email sent successfully.");
        return new APIResponse(200, null, "Result email sent successfully").send(res);
    }catch(error) {
        console.error("Error sending result email:", error);
        return new APIError(500, [error.message]).send(res);
    }
};


