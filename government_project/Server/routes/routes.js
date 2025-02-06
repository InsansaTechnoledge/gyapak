import authorityRoutes from './authorityRoutes.js';
import organizationRoutes from './organizationRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import eventRoutes from './eventRoutes.js';
import {createDb} from '../controller/dbController.js';

const routes=(app)=>{
    app.use('/api/authority',authorityRoutes);
    app.use('/api/organization',organizationRoutes);
    app.use('/api/category',categoryRoutes);
    app.use('/api/events',eventRoutes);
    app.get('/db',createDb);
};
export default routes;