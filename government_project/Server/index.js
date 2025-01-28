import app from './app.js';
const PORT = process.env.PORT || 5000;
const PORT1 = 5000;


const initializeServer = async(port)=>{
    try{
        const App = await app();
        if(App){
            App.get('/',(req,res)=>{
                res.send("Server is running perfectly !!");
            });

            App.listen(port, () => {
                console.log(`Server is running on port ${port}`);
              }).on("error", (err) => {
                if (err.code === "EADDRINUSE") {
                  console.warn(`Port ${port} is busy. Trying port ${PORT1}...`);
                  if (port === PORT) {
                    initializeServer(PORT1); // Try the fallback port
                  } else {
                    console.error(`All ports are busy. Unable to start the server.`);
                  }
                } else {
                  console.error("Server error:", err);
                }
              });
        }
    }catch(err){
        console.error("Error in initializing server",err);
        process.exit(1);
    }
};

initializeServer(PORT);