if(process.env.NODE_ENV !== "production"){
  (await import('dotenv')).config();
}
import express from 'express';
import routes from '../routes/routes.js';
import cors from 'cors';

const app=express();

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.CLIENT_BASE_URL_LOCAL,
  process.env.CLIENT_BASE_URL_LIVE            // Second front-end URL (local development)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) { // Allow requests with no origin (e.g., Postman, curl)
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'), false);
      }
    },
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors()); 

// app.use((req, res, next) => {
//   res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none'); 
//   res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); 
//   next();
// });

// Handle preflight requests
app.use((req, res, next) => {

  const origin = req.headers.origin;
  
  // Check if the request's origin is in the allowed list
  if (allowedOrigins.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin); // Allow the origin of the request
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Handle preflight (OPTIONS) request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);


export default app;