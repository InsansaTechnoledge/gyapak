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
      console.log(`Origin: ${origin}`); // Debug origin
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`), false);
      }
    },
    credentials: true,
  })
);



app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).send();
  } else {
    res.status(403).send('CORS not allowed');
  }
});

 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);


export default app;