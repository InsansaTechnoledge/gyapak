import organizationRoute from './organizationRoutes.js'
import eventRoute from './eventRoutes.js'
import categoryRoute from './categoryRoutes.js'
import searchRoute from './searchRoutes.js'
import contactRoute from './contactRoutes.js'
import stateRoute from './stateRoutes.js'
import admitCardRoute from './admitCardRoutes.js'
import resultRoute from './resultRoutes.js'
import subscriber from './subscriberRoutes.js'
import subjectRouter from './supabase/subject.route.js'
import questionRouter from './supabase/question.route.js'
import examRouter from './supabase/exam.route.js'
import eventRouter from './supabase/event.route.js'
import testResultRouter from './supabase/testResult.route.js'
import authRoutes from './mongoRoutes/auth.routes.js';
import userRoutes from './mongoRoutes/user.routes.js';
import paymentRoute from './mongoRoutes/payment.routes.js';
import commentRoute from './mongoRoutes/premiumComment.routes.js';
import emailRoutes from './mongoRoutes/email.routes.js';
import adminRoutes from './supabase/admin.routes.js'
import instituteRoutes from './mongoRoutes/institute.routes.js';

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
    
    app.use('/api/v1i2/auth', authRoutes);
    app.use('/api/v1i2/user', userRoutes);
    app.use('/api/v1i2/subject' , subjectRouter);
    app.use('/api/v1i2/question', questionRouter);
    app.use('/api/v1i2/exam' , examRouter);
    app.use('/api/v1i2/event', eventRouter);
    app.use('/api/v1i2/testresult' , testResultRouter);
    app.use('/api/v1i2/comment' , commentRoute);
    app.use('/api/v1i2/payment', paymentRoute);
    app.use('/api/v1i2/email',emailRoutes);
    app.use('/api/v1i2/admin' ,adminRoutes )
    app.use('/api/v1i2/institute-register' , instituteRoutes)
    app.get('/api', (req,res) => {
        res.send("Till API");
    });


}
export default routes;