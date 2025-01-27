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

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (allowedOrigins.includes(origin) || !origin) { // Allow requests with no origin (e.g., Postman, curl)
//         callback(null, true);
//       } else {
//         callback(new Error('CORS not allowed'), false);
//       }
//     },
//     credentials: true, 
//     // allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );


// app.options('*', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', req.headers.origin || process.env.CLIENT_BASE_URL_LIVE);
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.status(204).send();
// });


app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`Origin: ${origin}`); // Debug origin
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`), false);
      }
    },
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);


export default app;