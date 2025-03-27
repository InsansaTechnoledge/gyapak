import mongoose from 'mongoose';

const ConnectMongo = async function () {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        // mongoose.connect(MONGO_URI)
        // .then(console.log("Connected to MongoDB",ConnectMongo.connection.host))
        // .catch(err => console.log(err, "Error connecting to MongoDB"));
        console.log(`mongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`mongoDB connection error: ${error}`);
        process.exit(1);
    }
};

export default ConnectMongo;
