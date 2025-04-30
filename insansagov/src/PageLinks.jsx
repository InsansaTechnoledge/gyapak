import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Credits from './Pages/PrivacyPolicy/Credits';
import { RingLoader } from 'react-spinners';
import CounselorChatUI from './Pages/counselor/GyapakCounselor';

// Lazy load the components
const Landing = lazy(() => import('./Pages/Landing/landing'));
const Navbar = lazy(() => import('./Components/Navbar/Navbar'));
const Opportunities = lazy(() => import('./Pages/Opportunities/Opportunities'));
const Footer = lazy(() => import('./Components/Footer/Footer'));
const SearchPage = lazy(() => import('./Pages/Search/Search'));
const Authority = lazy(() => import('./Pages/Authority/Authority'));
const ChatBot = lazy(() => import('./Components/ChatBot/ChatBot'));
const ScrollToTop = lazy(() => import('./Components/ScrollTop/ScrollTopTo'));
const ErrorPage = lazy(() => import('./Pages/Error/ErrorPage'));
const Category = lazy(() => import('./Pages/Category/Category'));
const AdmitCardPage = lazy(() => import('./Pages/AdmitCard/AdmitCardPage'));
const Results = lazy(() => import('./Pages/ResultPage/ResultPage'));
const TrendingPage = lazy(() => import('./Pages/Trending/Trending'));
const StatePage = lazy(() => import('./Pages/State/StatePage'));
const PrivacyPolicy = lazy(() => import('./Pages/PrivacyPolicy/Privacy'));
const PortalCoverPage = lazy(() => import('./Pages/FutureStartPage/PortalCoverPage'));
const Unsubscribe = lazy(() => import('./Pages/Unsubscribe/Unsubscribe'));
const OverviewPage = lazy(() => import('./Pages/OverviewPage/Overview'));
const BlogPage = lazy(() => import('./Components/BolgPage/BlogPage'));
const BlogDetailPage = lazy(() => import('./Components/BolgPage/components/BlogDetailPage'))
const CalendarView = lazy(() => import('./Pages/Calendar/CalendarView'));
const CurrentAffairPage = lazy(() => import('./Components/currentAffairs/currentAffairPage'))
const CurrentAffairDetails = lazy(() => import('./Components/currentAffairs/CurrentAffairDetailPage'))


const SecondRoutes = () => {
    const location = useLocation();

    if (location.pathname === '/government-jobs-after-12th') {
        return null;
    }

    return (
        <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
            <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
                <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
            </div></div>}>
                <Routes>
                    <Route path='/top-exams-for-government-jobs-in-india/:slug' element={<Opportunities />} />
                    <Route path='/counselor' element={<CounselorChatUI />} />
                    <Route path='/search' element={<SearchPage />} />
                    <Route path='/organization/government-competitive-exams-after-12th/:name' element={<Authority />} />
                    <Route path='/category' element={<Category />} />
                    <Route path='/admit-card' element={<AdmitCardPage />} />
                    <Route path='/results' element={<Results />} />
                    <Route path='/trending' element={<TrendingPage />} />
                    <Route path='/overview' element={<OverviewPage />} />

                    <Route path='/state/:keyword' element={<StatePage />} />
                    <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                    <Route path='/credits' element={<Credits />} />
                    <Route path='/unsubscribe' element={<Unsubscribe />} />
                    <Route path='/blog' element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogDetailPage />} />
                    <Route path="/government-calendar" element={<CalendarView />} />
                    <Route path="/current-affairs/:date/:slug" element={<CurrentAffairDetails />} />



                    <Route path="/current-affair" element={<CurrentAffairPage />} />


                    <Route path='*' element={<ErrorPage code={404} message={"Oops! Page Not Found"} subMessage={"The page you’re looking for doesn’t exist or has been moved."} />} />


                </Routes>
            </Suspense>
        </div>
    );
};

const PageLinks = () => {
    return (
        <Router>
            <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
                <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
            </div></div>}>
                <Routes>
                    <Route path='/cover' element={<PortalCoverPage />} />
                </Routes>
                <ScrollToTop />
                <Navbar />
                <Routes>
                    <Route path='/' element={<Navigate to="/government-jobs-after-12th" replace />} />
                    <Route path='/government-jobs-after-12th' element={<Landing />} />
                </Routes>
                <SecondRoutes />
                <ChatBot />
                <Footer />
            </Suspense>

        </Router>
    );
};

export default PageLinks;
