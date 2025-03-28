import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const ConnectMongo = async function () {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => console.log('MongoDB connected successfully'))
      .catch((err) => console.error('MongoDB connection error:', err));
};

export default ConnectMongo;
