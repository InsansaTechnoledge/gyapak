import React, { Suspense, memo, useMemo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import HeroBg from '../../assets/Landing/heroBG.webp';

const Search = memo(React.lazy(() => import('../Search/Search')));

const Hero = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [currentSearchTip, setCurrentSearchTip] = useState(0);

    const searchTips = [
        "UPSC",
        "Banking",
        "NDA",
        "SSC",
        "Railway",
        "Medical",
        "Civil services"

    ];

    const popularSearches = [
        { query: "UPSC", label: "UPSC Exam Dates" },
        { query: "SSC", label: "SSC Latest Updates" },
        { query: "Banking", label: "Bank Exam Calendar" },
        { query: "NDA", label: "NDA Application Dates" }
    ];

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentSearchTip(prev => (prev + 1) % searchTips.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const searchHandler = useMemo(() => (input) => {
        navigate(`/search?query=${encodeURIComponent(input)}`);
    }, [navigate]);

    return (
        <>
            <HelmetProvider >
                <title>Gyapak - Your Ultimate Resource for Government Exam Dates</title>
                <meta name="description" content="Find important dates and schedules for UPSC, SSC, Banking, and other government exams. Stay updated with the latest exam calendars and notifications." />
                <meta name="keywords" content="government exams, UPSC dates, SSC calendar, bank exam schedule, NDA exam dates" />
                <link rel="canonical" href="https://gyapak.com" />
            </HelmetProvider>

            <motion.div
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Accessible Background */}
                <div className="absolute inset-0 z-0">
                    <picture>
                        <source
                            srcSet={`${HeroBg}?format=webp&width=480 480w, ${HeroBg}?format=webp&width=1024 1024w, ${HeroBg}?format=webp&width=1920 1920w`}
                            sizes="(max-width: 480px) 480px, (max-width: 1024px) 1024px, 1920px"
                            type="image/webp"
                        />
                        <img
                            src={HeroBg}
                            alt="Study preparation background"
                            loading="eager"
                            fetchpriority="high"
                            className="w-full h-full object-cover"
                            aria-hidden="true"
                        />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 "></div>
                </div>

                {/* Main Content */}
                <motion.div
                    className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <div className="max-w-3xl mx-auto">
                        {/* Logo and Heading */}
                        <motion.h1
                            className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 text-white"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-400 text-transparent bg-clip-text animate-gradient-x">
                                gyapak
                            </span>
                        </motion.h1>

                        {/* Dynamic Tagline */}
                        <motion.p
                            className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100 mb-8 sm:mb-10 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="inline-block border-b-4 border-indigo-500 pb-1 hover:border-purple-500 transition-colors duration-300">
                                Your Ultimate Resource
                            </span>
                            <span className="block xs:inline-block px-2">for</span>
                            <motion.span
                                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-2 rounded-lg text-white shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Important Dates
                            </motion.span>
                        </motion.p>

                        {/* Enhanced Search Container */}
                        <div className="w-full max-w-xl mx-auto mb-10 relative">
                            <motion.div
                                className="relative rounded-xl overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x"></div>
                                <div className="relative m-[2px] bg-black/80 rounded-lg p-1">
                                    <Suspense fallback={
                                        <div className="h-14 bg-black/50 rounded-lg flex items-center justify-center">
                                            <div className="flex space-x-2">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-2 h-2 bg-indigo-400 rounded-full"
                                                        animate={{
                                                            scale: [1, 1.5, 1],
                                                            opacity: [1, 0.5, 1]
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Infinity,
                                                            delay: i * 0.2
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    }>
                                        <Search searchHandler={searchHandler} />
                                    </Suspense>
                                </div>
                            </motion.div>

                            {/* Dynamic Search Tips */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSearchTip}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-3 text-sm text-gray-300"
                                >
                                    Try searching for "{searchTips[currentSearchTip]}"
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Interactive Call-to-Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                            {['Trending Topics', 'Visit Insansa.com'].map((label, index) => (
                                <motion.div
                                    key={label}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto"
                                >
                                    {index === 0 ? (
                                        <Link to="/trending" className="block">
                                            <button className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                                </svg>
                                                {label}
                                            </button>
                                        </Link>
                                    ) : (
                                        <a href="https://insansa.com" target="_blank" rel="noopener noreferrer" className="block">
                                            <button className="w-full px-8 py-4 bg-transparent border-2 border-white/80 hover:border-white text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/10 flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                                </svg>
                                                {label}
                                            </button>
                                        </a>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Interactive Popular Searches */}
                        <motion.div
                            className="mt-10 space-y-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-gray-300 text-sm mb-3">Popular searches:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {popularSearches.map(({ query, label }) => (
                                    <motion.div
                                        key={query}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to={`/search?query=${query}`}
                                            className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-colors duration-300"
                                        >
                                            {label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            <style jsx>{`
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .animate-gradient-x {
                    animation: gradient-x 3s ease infinite;
                    background-size: 200% 100%;
                }

                @media (min-width: 375px) {
                    .xs\\:text-6xl { font-size: 3.75rem; line-height: 1; }
                    .xs\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                    .xs\\:inline-block { display: inline-block; }
                }
            `}</style>
        </>
    );
};

export default Hero;