import expressApp from './config/express.js';
import db from './config/database.js';
import { connectToSupabase } from './config/supabaseClient.js';

const App=async()=>{
    try{
        await db();

        await connectToSupabase();

        return expressApp;
    } catch(err){
        console.error("Error while starting the app. Error : ",err);
        process.exit(1);
    }
};

export default App;