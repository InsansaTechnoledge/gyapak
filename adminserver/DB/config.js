import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const ConnectMongo = async function () {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(async() => {console.log('MongoDB connected successfully');
         console.log(`MongoDb connected on ${mongoose.connection.name }`);

        const indexes = await mongoose.connection.db.collection('events').indexes();
        console.log('Indexes on events collection:', indexes);
      }
    )
      .catch((err) => console.error('MongoDB connection error:', err));
};

export default ConnectMongo;
