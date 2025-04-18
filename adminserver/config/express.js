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
      origin: ['http://localhost:5174' ,  'http://localhost:5173 , https://gyapak.in'], 
      credentials: true, 
    })
  );
  
ExpressApp.use(cookieParser());

route(ExpressApp);

export default ExpressApp;
