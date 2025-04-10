import organizationRoute from './organizationRoutes.js'
import eventRoute from './eventRoutes.js'
import categoryRoute from './categoryRoutes.js'
import searchRoute from './searchRoutes.js'
import contactRoute from './contactRoutes.js'
import stateRoute from './stateRoutes.js'
import admitCardRoute from './admitCardRoutes.js'
import resultRoute from './resultRoutes.js'
import subscriber from './subscriberRoutes.js'
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const routes = (app) => {

    app.use('/api/organization', organizationRoute);
    app.use('/api/event', eventRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/search', searchRoute);
    app.use('/api/contact', contactRoute);
    app.use('/api/state', stateRoute);
    app.use('/api/admitCard', admitCardRoute);
    app.use('/api/result', resultRoute);
    app.use('/api/subscriber', subscriber);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/user', userRoutes);

    app.get('/api', (req,res) => {
        res.send("Till API");
    });

}
export default routes;