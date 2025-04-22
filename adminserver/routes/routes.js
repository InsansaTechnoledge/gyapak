import organizationRoutes from './organizationRoutes.js';
import stateRoutes from './state.routes.js';
import uploadRoutes from './upload.routes.js';
import BlogRoutes from './blog.routes.js';
import affairRoutes from './currentAffair.routes.js'

const route = (app) => {
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/states', stateRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1i2/blog', BlogRoutes);
app.use('/api/v1i2/affair', affairRoutes);
};

export default route;
