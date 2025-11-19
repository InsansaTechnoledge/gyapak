import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Credits from './Pages/PrivacyPolicy/Credits';
import { RingLoader } from 'react-spinners';
import CounselorChatUI from './Pages/counselor/GyapakCounselor';
import { useApi } from './Context/ApiContext';

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
const BlogDetailPage = lazy(() => import('./Components/BolgPage/components/BlogDetailPage'));
const CalendarView = lazy(() => import('./Pages/Calendar/CalendarView'));
const CurrentAffairPage = lazy(() => import('./Components/currentAffairs/currentAffairPage'));
const CurrentAffairDetails = lazy(() => import('./Components/currentAffairs/CurrentAffairDetailPage'));
const DailyUpdatesReels = lazy(() => import('./Components/DailyUpdatePdf/DailyUpdatesReels'))
const Pdfpage = lazy(()=>import('../src/Components/PdfPage/PdfPage'));

const PageLinks = () => {
  const {apiBaseUrl} = useApi();

  const Loading = () => (
    <div className='w-full h-screen flex justify-center'>
      <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
    </div>
  );


  const location = useLocation();
  const hideChatBotOn = ['/government-calendar'];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial state
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldHideChatBot = isMobile && hideChatBotOn.includes(location.pathname);

 

  

  return (
    <>
     {/* <Suspense fallback={<Loading />}> */}
     
      <ScrollToTop />
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Landing />} />
        {/* <Route path='/' element={<Navigate to="/government-jobs-after-12th" replace />} /> */}
        {/* <Route path='/cover' element={<PortalCoverPage />} /> */}
        
        {/* Routes that use the content container */}
        <Route 
          path='/top-exams-for-government-jobs-in-india/:slug' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <Opportunities />
            </div>
          } 
        />
        <Route 
          path='/counselor' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <CounselorChatUI />
            </div>
          }
        />
        <Route 
          path='/search' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <SearchPage />
            </div>
          }
        />
        <Route 
          path='/organization/government-competitive-exams-after-12th/:name' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <Authority />
            </div>
          }
        />
        <Route 
          path='/government-organisations-under-category' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <Category />
            </div>
          }
        />
        <Route 
          path='/admit-card' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <AdmitCardPage />
            </div>
          }
        />
        <Route 
          path='/results' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <Results />
            </div>
          }
        />
        <Route 
          path='/trending' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <TrendingPage />
            </div>
          }
        />
        <Route 
          path='/overview' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <OverviewPage />
            </div>
          }
        />
        <Route 
          path='/state/:keyword' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <StatePage />
            </div>
          }
        />
        <Route 
          path='/privacy-policy' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <PrivacyPolicy />
            </div>
          }
        />
        <Route 
          path='/credits' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <Credits />
            </div>
          }
        />
        <Route 
          path='/unsubscribe' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <Unsubscribe />
            </div>
          }
        />
        <Route 
          path='/blog' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <BlogPage />
            </div>
          }
        />
        <Route 
          path="/blog/:slug" 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <BlogDetailPage />
            </div>
          }
        />
        <Route 
          path="/government-calendar" 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <CalendarView />
            </div>
          }
        />
        <Route 
          path="/current-affairs/:date/:slug" 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <CurrentAffairDetails />
            </div>
          }
        />

         <Route 
          path="/daily-updates" 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <DailyUpdatesReels />
            </div>
          }
        />
        {/* <Route path="/daily-updates" element={<DailyUpdatesReels />} /> */}

        <Route 
          path="/current-affair" 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <CurrentAffairPage />
            </div>
          }
        />
        <Route
        path='/pdf'
        element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <Pdfpage/>
            </div>
        }
        />
        
        {/* Catch-all route for 404s */}
        <Route 
          path='*' 
          element={
            <div className='px-5 md:px-16 lg:px-32 xl:px-64'>
              <ErrorPage 
                code={404} 
                message={"Oops! Page Not Found"} 
                subMessage={"The page you're looking for doesn't exist or has been moved."} 
              />
            </div>
          }
        />
      </Routes>

      {!shouldHideChatBot && <ChatBot />}
      <Footer />
    {/* </Suspense> */}
    </>
    
  );
};

export default PageLinks;