import crypto from 'crypto';
import { transporter } from './contactController.js';
import Subscriber from '../models/SubscriberModel.js';
const emailSentCache = new Set(); // Example if using a Map for caching


// subscribed user mailing list
export const updateMail = async (email, name,unsubscribeToken) => {
    try {
          if (emailSentCache.has(email)) {
            console.log(`Email to ${email} already sent recently.`);
            return;
        }

        emailSentCache.add(email);
        setTimeout(() => emailSentCache.delete(email), 60000); 

        const mailOptions = {
            from: process.env.EMAIL1,
            to: email,
            replyTo: process.env.EMAIL1,
            subject: `Hello ${name}`,
            html: `
                <p>Dear ${name},</p>
                <p>We wanted to let you know that there are new updates available on our website!</p>
                <p>Visit <a href="https://gyapak.in/" target="_blank">gyapak.in</a> to explore the latest updates and new data.</p>
                <p>If you have any questions or need assistance, please feel free to reply to this email or contact us directly.</p>
                <p>Thank you for staying with us!</p>
                <br>
                <p>Warm regards,</p>
                <p><b>Insansa Techknowledge Pvt. Ltd.</b></p>
                <p><a href="https://insansa.com/" target="_blank">insansa.com</a></p>
                <p>+91 9724379123 | 0265-4611836</p>
                <br>
                <a 
                href="${process.env.CLIENT_BASE_URL_LIVE}/unsubscribe?token=${unsubscribeToken}"
                style="background-color:#b621a8; color: white; padding: 10px 20px; text-decoration: none; border: none; cursor: pointer;">
                    Click here to unsubscribe
                </a>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log('Update email sent');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Internal Server Error');
    }
};

export const create = async (req, res) => {
    let subscriber = await Subscriber.findOne({ email: req.body.email });
        if(!subscriber){
        try {
            subscriber = new Subscriber({
                name: req.body.name,
                email: req.body.email,
                unsubscribeToken: crypto.randomBytes(16).toString('hex') // Generate a unique unsubscribe token
            });
            await subscriber.save();
            console.log('Subscriber created:', subscriber);

            subscribeMail(subscriber.email, subscriber.name, subscriber.unsubscribeToken);

            res.status(201).json("Subscriber created successfully");
        } catch (error) {
            console.error('Error creating subscriber:', error);
            res.status(500).json({ message: "Internal Server Error" });
        }}
        else if(subscriber.isSubscribed){
                return res.status(202).json("Subscriber already exists");
            }
         else {
            subscriber.isSubscribed=true;
            subscriber.save();
            subscribeMail(subscriber.email, subscriber.name, subscriber.unsubscribeToken);
            res.status(201).json("Subscriber created successfully");

        }
    
};

export const subscribeMail = async (email, name, unsubscribeToken) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL1,
            to: email,
            replyTo: process.env.EMAIL1,
            subject: `Thank you for subscribing, ${name}!`,
            html: `
                <p>Dear ${name},</p>
                <p>Thank you for subscribing to our website! We are thrilled to have you on board.</p>
                <p>Stay tuned for exciting updates, new features, and much more. We are committed to providing you with the best content and services.</p>
                <p>If you have any questions or need assistance, feel free to reply to this email or contact us anytime.</p>
                <br>
                <p>Warm regards,</p>
                <p><b>"<a href="https://insansa.com/" target="_blank">Insansa Techknowledge Pvt. Ltd.</b></p>
                <p><a href="https://gyapak.in/" target="_blank">gyapak.in</a></p>
                <p>+91 9724379123 | 0265-4611836</p>
                <br>
                <a 
                href="${process.env.CLIENT_BASE_URL_LIVE}/unsubscribe?token=${unsubscribeToken}"
                style="background-color:#b621a8; color: white; padding: 10px 20px; text-decoration: none; border: none; cursor: pointer;">
                    Click here to unsubscribe
                </a>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Subscription email sent');
    } catch (error) {
        console.error('Error sending subscription email:', error);
        throw new Error('Internal Server Error');
    }
};

export const unsubscribe = async (req, res) => {
    const { token } = req.body;

    console.log("path to un subscribe",token);

    if (!token) {
        return res.status(400).send('Invalid unsubscribe request.');
    }

    try {
        const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
        if (!subscriber) {
            return res.status(404).json('Subscriber not found.');
        }
        if(!subscriber.isSubscribed){
            return res.status(202).json('You Have Unsubscribed already!!!');
        }
        else{

        // Update subscription statuse
        subscriber.isSubscribed = false;
        await subscriber.save();
        
        res.status(201).json('You have successfully unsubscribed.');
    }

        
    } catch (error) {
        console.error('Error processing unsubscribe request:', error);
        res.status(500).send('An error occurred. Please try again.');
    }
};
