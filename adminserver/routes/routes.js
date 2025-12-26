import organizationRoutes from './organizationRoutes.js';
import stateRoutes from './state.routes.js';
import uploadRoutes from './upload.routes.js';
import BlogRoutes from './blog.routes.js';
import eventRoutes from './event.routes.js';
import affairRoutes from './currentAffair.routes.js'
import FAQRoutes from './faq.routes.js'
import questionRoutes from './question.routes.js';
import reportRoutes from './report.routes.js';
import sourceRoutes from "./source.routes.js";
import notificationRoutes from "./notification.routes.js";
import gscRoutes from './gscRoutes.js';
import indexingRoutes from './indexing.routes.js';
import airoutes from './openai.routes.js'
import quickResult from './Quiclresult.routes.js'
import themes from './theme.routes.js'

const route = (app) => {
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/states', stateRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1i2/blog', BlogRoutes)
app.use('/api/v1i2/event', eventRoutes);
app.use('/api/v1i2/affair', affairRoutes);
app.use('/api/v1i2/faq', FAQRoutes);
app.use('/api/v1i2/question', questionRoutes);
app.use('/api/v1i2/reports', reportRoutes);
app.use('/api/v1/convert', airoutes);
app.use("/api/sources", sourceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/gsc", gscRoutes)
app.use("/api/index", indexingRoutes)
app.use("/api/result-admitcard" , quickResult)
app.use("/api/theme", themes)


};

export default route;
