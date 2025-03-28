import ConnectMongo from './DB/config.js';
import ExpressApp from './config/express.js';

const app = async function () {
    try {
        // calling Db connct
        await ConnectMongo();

        // calling express app
        return ExpressApp;
    } catch (error) {
        console.log(error);
    }
};

export default app;
