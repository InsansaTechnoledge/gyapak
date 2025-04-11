    import nodemailer from "nodemailer";
    import { EMAIL,PASSWORD } from "../../config/env.js";


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: EMAIL,
            pass: PASSWORD
        },
    });
    
    transporter.verify(error => {
        if (error) {
            console.error("Error configuring transporter", error);
        } else {
            console.log("Transporter is configured and ready to send Emails.");
        }
    });

    const sendEmail = async (email, subject, text) => {
        try {
            const mailOptions = {
                from: EMAIL,
                to: email,
                subject: subject,
                html: text,
            };
    
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully.");
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }
    
    export default sendEmail;

