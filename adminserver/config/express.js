import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import route from '../routes/routes.js';

const ExpressApp = express();

ExpressApp.set('trust proxy', 1);

ExpressApp.use(express.json());
ExpressApp.use(express.urlencoded({ extended: true }));

ExpressApp.use(
    cors({
      origin: ['https://d2gcq65jmgagh2.cloudfront.net', 'http://localhost:5174', 'http://localhost:5173', 'https://gyapak.in' , 'https://gyapak-admin-upload-data.vercel.app'],
      credentials: true,
    })
  );
  
  
ExpressApp.use(cookieParser());

route(ExpressApp);

export default ExpressApp;
