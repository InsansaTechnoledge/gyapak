import dotenv from 'dotenv'
import { getCentralOrganization } from './controllers/organization.controller.js';

dotenv.config();

const app = (await import('./app.js')).default;

const initialize = async () => {
    try {
        const appInstance = await app();

        appInstance.get('/', (req, res) => {
            console.log('server is live ');
            res.status(200).json({
                message: 'server is running',
            });
        });

        // appInstance.get('/api/v1/organizations/central', getCentralOrganization);

        appInstance.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.log(err, 'There was an error initializing the server');
    }
};

initialize();
