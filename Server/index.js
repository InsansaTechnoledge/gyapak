import app from './app.js';
import routes from './routes/routes.js';
const PORT = process.env.PORT || 5000;

const initializeServer = async()=>{
    try{
        const App = await app();
        if(App){
            App.get('/',(req,res)=>{
                res.send("Server is running perfectly !!");
            });

            App.listen(PORT,()=>{
                console.log(`Server is running on port ${PORT}`);

            });
        }
    }catch(err){
        console.error("Error in initializing server",err);
        process.exit(1);
    }

};

initializeServer();