import mongoose from "mongoose";

const connectDB = async () => {

   try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        });
        console.log(`Database connected successfully on ${process.env.MONGO_URI}`);
    } catch (err) {
        console.error('Database connection failed. Error:', err);
        process.exit(1);
    }
};

export default connectDB;