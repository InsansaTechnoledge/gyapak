import ExpressApp from './Config/express.js';
import ConnectMongo from './DB/config.js';

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
