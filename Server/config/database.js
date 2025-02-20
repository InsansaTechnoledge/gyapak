import mongoose from "mongoose";
import { startChangeStream } from "./watch.js";

const checkAndDropIndex = async (collection, indexName) => {
    const indexes = await collection.indexes();
    const indexExists = indexes.some(index => index.name === indexName);
    if (indexExists) {
        await collection.dropIndex(indexName);
    } else {
        console.log(`Index ${indexName} does not exist.`);
    }
};

const connectDB = async () => {
    try {

        await mongoose.connection.once('open',async()=>{
            startChangeStream();
        })
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connected on ${mongoose.connection.host}`);

        const db = mongoose.connection.db;

        // // Check if index exists before dropping
        // await checkAndDropIndex(db.collection("organizations"), "abbreviation_text");
        // await checkAndDropIndex(db.collection("authorities"), "name_text");
        // await checkAndDropIndex(db.collection("categories"), "category_text");

        // // Create new indexes
        // await db.collection("authorities").createIndex({ name: "text" });

        // await db.collection("organizations").createIndex({ abbreviation: "text" });

        // await db.collection("categories").createIndex({ category: "text" });

    } catch (err) {
        console.error('Database connection failed. Error:', err);
        process.exit(1);
    }
};

export default connectDB;
