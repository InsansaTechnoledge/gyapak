import mongoose from "mongoose";
import { startChangeStream } from "./watch.js";
import { MONGO_URI } from "./env.js";

const checkAndDropIndex = async (collection, indexName) => {
  try {
    const indexes = await collection.indexes();
    const indexExists = indexes.some((index) => index.name === indexName);

    if (indexExists) {
      console.log(`Dropping index: ${indexName}`);
      await collection.dropIndex(indexName);
    } else {
      console.log(`Index ${indexName} does not exist.`);
    }
  } catch (err) {
    // NamespaceNotFound = collection doesn't exist yet
    if (err.code === 26) {
      console.log(
        `Collection "${collection.collectionName}" does not exist yet. Skipping index check for "${indexName}".`
      );
      return;
    }
    throw err; // rethrow anything else
  }
};

const setupIndexes = async (db) => {
  const orgCol = db.collection("organizations");
  const authCol = db.collection("authorities");
  const catCol = db.collection("categories");

  // Drop old text indexes if they exist
  await checkAndDropIndex(orgCol, "abbreviation_text");
  await checkAndDropIndex(authCol, "name_text");
  await checkAndDropIndex(catCol, "category_text");

  // Create new text indexes
  // createIndex will auto-create the collection if needed
  await authCol.createIndex({ name: "text" });
  await orgCol.createIndex({ abbreviation: "text" });
  await catCol.createIndex({ category: "text" });

  console.log("✅ Text indexes ensured on authorities, organizations, categories");
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB connected on ${mongoose.connection.host}`);

    const db = mongoose.connection.db;

    // 1️⃣ Setup indexes (but be tolerant if collections are not there yet)
    await setupIndexes(db);

    // 2️⃣ Start change stream after connection is ready
    mongoose.connection.once("open", () => {
      console.log("🔁 Starting change stream watcher…");
      startChangeStream();
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongo connection error:", err);
    });
  } catch (err) {
    console.error("Database connection failed. Error:", err);
    process.exit(1);
  }
};

export default connectDB;
