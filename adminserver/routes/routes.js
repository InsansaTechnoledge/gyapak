import organizationRoutes from './organizationRoutes.js';

const route = (app) => {
app.use('api/v1/organizations', organizationRoutes);
};

export default route;
