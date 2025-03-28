import organizationRoutes from './organizationRoutes.js';
import stateRoutes from './state.routes.js';
import uploadRoutes from './upload.routes.js';

const route = (app) => {
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/states', stateRoutes);
app.use('/api/v1/upload', uploadRoutes);

};

export default route;
