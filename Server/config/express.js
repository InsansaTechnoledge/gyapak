if(process.env.NODE_ENV !== "production"){
  (await import('dotenv')).config();
}
import express from 'express';
import routes from '../routes/routes.js';
import cors from 'cors';

const app=express();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: `${process.env.CLIENT_BASE_URL}`,
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }
));

app.options('*', cors()); 

// app.use((req, res, next) => {
//   res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none'); 
//   res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); 
//   next();
// });

// Handle preflight requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_BASE_URL);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);


export default app;