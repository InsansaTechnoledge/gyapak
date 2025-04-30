import React, { Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import curvLine from '../../assets/Landing/curvLine.svg';
import { Helmet } from "react-helmet-async";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Skeleton Components
const SkeletonPulse = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-full w-full" />
);

const ComponentLoader = ({ height = "h-64" }) => (
  <div className={`w-full ${height} flex items-center justify-center bg-gray-50 rounded-lg`}>
    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
  </div>
);

// Lazy loaded components with specific loading states
const Hero = React.lazy(() => import('../../Components/Hero/Hero'));
const LatestUpdates = React.lazy(() => import('../../Components/Updates/LatestUpdates'));
const TopAuthorities = React.lazy(() => import('../../Components/Authority/TopAuthorities'));
const TopCategories = React.lazy(() => import('../../Components/Categories/TopCategories'));
const Contact = React.lazy(() => import('../../Components/ContactUs/Contact'));
const FeaturePage = React.lazy(() => import('../../Components/FeatureAdvertisement/Features'));
const FeatureBand = React.lazy(() => import('../../Components/FeatureAdvertisement/FeatureBand'));
// const AdmitCardDashboard = React.lazy(() => import('../../Components/AdmitCards/AdmitCard'));
// const ResultsDashboard = React.lazy(() => import('../../Components/ResultComponent/Results'));
const StateComponent = React.lazy(() => import('../../Components/States/State'));
const ImportantLinksDashboard = React.lazy(() => import('../../Components/ImportantLinks/ImportantLinks'))
const BlogBrandingPage = React.lazy(() => import('../../Components/BolgPage/components/BlogBranfingPage'))
const FAQ = React.lazy(() => import('../../Components/FAQ/FAQ'))
const WhatsAppGroupJoin = React.lazy(() => import('../../Components/WhatsAppGroup/whatsGroupJoinButton'))
// Enhanced LazyRender with loading states and error boundary
const LazyRender = ({ children, height = "h-64", priority = false, id }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    // Preload high priority components
    rootMargin: priority ? '200px' : '50px',
  });

  return (
    <div ref={ref} id={id}>
      {inView ? (
        <ErrorBoundary>
          <Suspense fallback={<ComponentLoader height={height} />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      ) : (
        <div className={height}>
          <SkeletonPulse />
        </div>
      )}
    </div>
  );
};

const Landing = () => {


  return (
    <>
      <Helmet>
        <title>gyapak</title>
        <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
        <meta name="keywords" content="government exams, exam dates, admit cards, results, central government jobs, state government jobs, competitive exams, government jobs, government jobs after 12, upcoming government exams 2025" />
        <meta property="og:title" content="gyapak" />
        <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
      </Helmet>
      <div className="min-h-screen">
        {/* Hero section loads immediately with high priority */}
        <LazyRender height="h-screen" priority={true}>
          <Hero />
        </LazyRender>

        <div className="px-4 md:px-16 lg:px-64 space-y-16">
          {/* Latest updates and state components load next */}
          <LazyRender height="h-96">
            <LatestUpdates />
          </LazyRender>

          <LazyRender height="h-80" id={"landing-state"}>
            <StateComponent />
          </LazyRender>

          <div className="grid md:grid-cols-1 gap-8">
            <LazyRender height="h-72" id={"landing-authorities"}>
              <TopAuthorities />
            </LazyRender>

            <LazyRender height="h-72" id={"landing-categories"}>
              <TopCategories />
            </LazyRender>
          </div>

          {/* <LazyRender height="h-96" id={"landing-admit"}>
            <AdmitCardDashboard />
          </LazyRender> */}

          {/* <LazyRender height="h-96" id={"landing-result"}>
            <ResultsDashboard />
          </LazyRender> */}

          <LazyRender height="h-96">
            <BlogBrandingPage />
          </LazyRender>

          <LazyRender height="h-96" id={"landing-result"}>
            <ImportantLinksDashboard />
          </LazyRender>

          <LazyRender height="h-96" id={"landing-result"}>
            <WhatsAppGroupJoin />
          </LazyRender>

          <LazyRender height="h-96" id={"landing-result"}>
            <FAQ />
          </LazyRender>

          


        </div>

        <img
          height={40}
          width={600}
          className="w-full mb-20 mt-20"
          src={curvLine}
          alt=""
          loading="lazy"
        />

        <div id="about">
          <LazyRender height="h-48">
            <FeatureBand />
          </LazyRender>
        </div>


        <div className="px-4 md:px-16 lg:px-64 space-y-16">

          <LazyRender height="h-96">
            <FeaturePage />
          </LazyRender>

          {/* Contact section */}
          <div id="contact">
            <LazyRender height="h-80">
              <Contact />
            </LazyRender>
          </div>
        </div>




      </div>
    </>
  );
};

export default Landing;