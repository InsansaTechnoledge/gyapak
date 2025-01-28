import dotenv from 'dotenv';
import express from 'express';
import routes from '../routes/routes.js';
import cors from 'cors';

dotenv.config();
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.set('trust proxy', 1);

app.use(
  cors({
    origin: `${process.env.CLIENT_BASE_URL}`,
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }
));

app.options('*', cors()); 

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none'); 
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); 
  next();
});




app.post('/api/createAuthority', (req, res) => {
  console.log("Request body:", req.body);  // Log to check if the body is parsed
  res.send("Test");
});


export default app;