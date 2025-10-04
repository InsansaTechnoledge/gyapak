import mongoose from 'mongoose';
import dotenv from 'dotenv'
import { scheduler } from './scheduleDeletion.js';

dotenv.config();

const ConnectMongo = async function () {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('MongoDB connected successfully');
        console.log(`MongoDb connected on ${mongoose.connection.name}`);

        const indexes = await mongoose.connection.db.collection('events').indexes();
        console.log('Indexes on events collection:', indexes);

        // scheduler(); // Start the scheduler after success

    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err; // Re-throw to prevent server from starting with failed DB connection
    }
};

export default ConnectMongo;
