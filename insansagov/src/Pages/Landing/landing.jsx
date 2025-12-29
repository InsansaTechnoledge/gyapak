// src/pages/Landing/Landing.jsx
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import curvLine from "../../assets/Landing/curvLine.svg";
import StatesLanding from "../../Components/States/StatesLanding";
import GyapakLanding from "../../Components/NewLandingPage/NewLanding";

import { LANDING_SECTIONS } from "../../constants/Constants";

/** -----------------------------
 * Error Boundary
 * ------------------------------*/
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
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

/** -----------------------------
 * Loaders
 * ------------------------------*/
const SkeletonPulse = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-full w-full" />
);

const ComponentLoader = ({ height = "h-64" }) => (
  <div
    className={`w-full ${height} flex items-center justify-center bg-gray-50 rounded-lg`}
  >
    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
  </div>
);

/** -----------------------------
 * Lazy loaded components
 * ------------------------------*/
const LatestUpdates = React.lazy(() =>
  import("../../Components/Updates/LatestUpdates")
);
const TopAuthorities = React.lazy(() =>
  import("../../Components/Authority/TopAuthorities")
);
const TopCategories = React.lazy(() =>
  import("../../Components/Categories/TopCategories")
);
const FeaturePage = React.lazy(() =>
  import("../../Components/FeatureAdvertisement/Features")
);
const FeatureBand = React.lazy(() =>
  import("../../Components/FeatureAdvertisement/FeatureBand")
);
const ResultsDashboard = React.lazy(() =>
  import("../../Components/ResultComponent/Results")
);
const FAQ = React.lazy(() => import("../../Components/FAQ/FAQ"));
const WhatsAppGroupJoin = React.lazy(() =>
  import("../../Components/WhatsAppGroup/whatsGroupJoinButton")
);

/** -----------------------------
 * LazyRender wrapper
 * ------------------------------*/
const LazyRender = ({ children, height = "h-64", priority = false, id }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: priority ? "200px" : "50px",
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

/** -----------------------------
 * Helpers
 * ------------------------------*/
const normalizeAndSortSections = (sections) => {
  
  const sorted = [...(sections || [])]
    .filter((s) => s?.enabled !== false)
    .sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999));

  // Optional: prevent duplicate keys by keeping first occurrence only
  const seen = new Set();
  const unique = [];
  for (const s of sorted) {
    if (!s?.key || seen.has(s.key)) continue;
    seen.add(s.key);
    unique.push(s);
  }

  return unique.map((s, idx) => ({ ...s, order: idx + 1 }));
};

/** -----------------------------
 * Landing Page
 * ------------------------------*/
const Landing = () => {
  const location = useLocation();
  const contactRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#contact" && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // ✅ Registry: key -> component (kept in code for safety)
  const registry = useMemo(
    () => ({
      gyapakLanding: <GyapakLanding />,
      
      whatsappJoin: <WhatsAppGroupJoin />,

      // quickResults: <ResultsDashboard />,

      // latestUpdates: <LatestUpdates />,

      states: <StatesLanding />,

      authoritiesAndCategories: (
        <div className="grid md:grid-cols-1 gap-8">
          <div>
            <TopAuthorities />
          </div>
          <div>
            <TopCategories />
          </div>
        </div>
      ),

      

      // faq: <FAQ />,

      // curveDivider: (
      //   <img
      //     height={40}
      //     width={600}
      //     className="w-full mb-20 mt-20"
      //     src={curvLine}
      //     alt="Curve Line"
      //     loading="lazy"
      //   />
      // ),

      // featureBand: (
      //   <div id="about">
      //     <FeatureBand />
      //   </div>
      // ),

      // featurePage: <FeaturePage />,
    }),
    []
  );

  // ✅ Sort by "order" (No. wise) + normalize
  const sectionsToRender = useMemo(
    () => normalizeAndSortSections(LANDING_SECTIONS),
    []
  );

  const renderSection = (sec) => {
    const node = registry?.[sec.key];
    if (!node) return null;

    const paddedWrap = (content) =>
      sec.padded ? <div className="px-6">{content}</div> : content;

    const inner =
      sec.wrapper === "lazy" ? (
        <LazyRender
          height={sec.height || "h-64"}
          priority={!!sec.priority}
          id={sec.id}
        >
          {node}
        </LazyRender>
      ) : (
        <div id={sec.id}>{node}</div>
      );

    return (
      <div key={sec.key}>
        {/* ✅ Optional: show No. in DOM (remove if not needed) */}
        {/* <div className="px-4 md:px-16 text-xs text-gray-400 mb-2">
          {sec.order}. {sec.key}
        </div> */}

        {paddedWrap(inner)}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Upcoming government exams - gyapak</title>
        <meta
          name="description"
          content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments."
        />
        <meta
          name="keywords"
          content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams"
        />
        <meta property="og:title" content="gyapak" />
        <meta
          property="og:description"
          content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs."
        />
      </Helmet>

      <div className="min-h-screen">
        <div className="space-y-16">{sectionsToRender.map(renderSection)}</div>

        {/* Contact ref reserved */}
        <div ref={contactRef} />
      </div>
    </>
  );
};

export default Landing;
