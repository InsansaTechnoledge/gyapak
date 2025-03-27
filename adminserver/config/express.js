import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import route from '../routes/routes.js';
import dotenv from 'dotenv';

dotenv.config();

const ExpressApp = express();

ExpressApp.use(express.json());
ExpressApp.use(express.urlencoded({ extended: true }));

ExpressApp.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

ExpressApp.use(cookieParser());

route(ExpressApp);

export default ExpressApp;
