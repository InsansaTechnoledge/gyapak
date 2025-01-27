import nodemailer from 'nodemailer';

if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
  }
  
  export const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
  port: 587,                   // Port for STARTTLS (not SSL)
  secure: false,  // Use STARTTLS
    auth: {
      user: process.env.EMAIL, // Your Outlook email address
      pass: process.env.PASSWORD, // Your Outlook email password or app password
    }
  });
  
  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('Error configuring transporter:', error);
    } else {
      console.log('Transporter is configured and ready to send emails.');
    }
  });

export const sendMailtoQueries = async (req, res) => {
    const {firstName, lastName, email,subject, message} = req.body;
try{
    const mailOptions={
    from: process.env.EMAIL, 
    to: process.env.EMAIL1,  
    replyTo: email,           
    subject: `New Query from ${firstName} ${lastName}`,
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `,

    }
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
    res.status(201).json({message:"email sent successfully!!"})
}
    catch(error){
        console.error('Error sending email:', error);
        res.status(500).json({message: "Internal Server Error"});

    }



};

export const sendMailtoUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      replyTo: process.env.EMAIL1,
      subject: `Thank You for Reaching Out to Us!`,
      html: `
        <p>Dear ${firstName} ${lastName},</p>

        <p>Thank you for contacting us! We have received your message and appreciate you taking the time to reach out.</p>

        <p>Our team is reviewing your inquiry and will get back to you as soon as possible. If your matter is urgent, please feel free to reply to this email or call us directly and we’ll prioritize your request.</p>

        <p>In the meantime, feel free to explore our website <b><a href="https://insansa.com" target="_blank">insansa.com</a></b> for more information about our services.</p>

        <p>We value your interest and look forward to assisting you!</p>

        <p>Warm regards,</p>
        <p><b>Insansa Techknowledge Pvt. Ltd.</b></p>
        <p>MyWebsite.com</p>
        <p>+91 9724379123 | 0265-4611836</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent');
    res.status(201).json({ message: "Email sent successfully!!" });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

