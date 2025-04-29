import organizationRoutes from './organizationRoutes.js';
import stateRoutes from './state.routes.js';
import uploadRoutes from './upload.routes.js';
import BlogRoutes from './blog.routes.js';
import eventRoutes from './event.routes.js';
import affairRoutes from './currentAffair.routes.js'
// import FAQRoutes from './FAQ.routes.js'
import FAQRoutes from './FAQ.routes.js'

const route = (app) => {
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/states', stateRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1i2/blog', BlogRoutes)
app.use('/api/v1i2/event', eventRoutes);
app.use('/api/v1i2/affair', affairRoutes);
app.use('/api/v1i2/faq', FAQRoutes);

};

export default route;
