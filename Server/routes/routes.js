import organizationRoute from './organizationRoutes.js'
import eventRoute from './eventRoutes.js'
import categoryRoute from './categoryRoutes.js'
import searchRoute from './searchRoutes.js'
import contactRoute from './contactRoutes.js'
import stateRoute from './stateRoutes.js'
import admitCardRoute from './admitCardRoutes.js'
import resultRoute from './resultRoutes.js'
import subscriber from './subscriberRoutes.js'
import subjectRouter from '../routes/supabase/subject.route.js'
import questionRouter from '../routes/supabase/question.route.js'
import examRouter from '../routes/supabase/exam.route.js'
import eventRouter from '../routes/supabase/event.route.js'

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
    app.get('/api', (req,res) => {
        res.send("Till API");
    });

    // supabase routes
    app.use('/api/v1i2/subject' , subjectRouter);
    app.use('/api/v1i2/question', questionRouter);
    app.use('/api/v1i2/exam' , examRouter);
    app.use('/api/v2i2/event', eventRouter);

}
export default routes;