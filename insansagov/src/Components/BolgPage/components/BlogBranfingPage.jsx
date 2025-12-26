import React, { useRef } from 'react';
import { ArrowRight, TrendingUp, Clock, Newspaper, Calendar, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const GyapakBlogBanner = () => {
  const bannerRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const featuresRef = useRef(null);

  return (
    <>
      <Helmet>
        <title>Gyapak Blog - Expert Resources for Government Exams & Tech</title>
        <meta name="description" content="Access premium study materials, expert tips, and the latest trends for government exams and technology. Boost your preparation with Gyapak's trusted resources." />
        <meta name="keywords" content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams" />
        <meta property="og:title" content="Gyapak Blog - Your Ultimate Resource for Exam Success" />
        <meta property="og:description" content="Premium study materials and expert guidance for government exams and technology trends." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gyapak.com/blog" />
        <meta property="og:image" content="https://gyapak.com/images/blog-banner.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gyapak Blog - Expert Resources for Government Exams" />
        <meta name="twitter:description" content="Access premium study materials and expert guidance for your exam preparation." />
        <meta name="twitter:image" content="https://gyapak.com/images/blog-banner.jpg" />
        <link rel="canonical" href="https://gyapak.com/blog" />
      </Helmet>

      <section
        ref={bannerRef}
        className="relative overflow-hidden bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-950 text-white rounded-2xl shadow-2xl p-6 md:p-10 my-8"
      >
        <div className="flex flex-col md:flex-row relative z-10 max-w-6xl mx-auto">
          {/* Left Side - Original Content */}
          <div className="md:w-1/2 text-center md:text-left md:pr-8 mb-10 md:mb-0">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-purple-100 bg-opacity-20 backdrop-blur-sm text-purple-100 text-sm font-medium mb-6 border border-purple-300 border-opacity-30">
              <span className="animate-pulse mr-2 w-2 h-2 bg-purple-300 rounded-full"></span>
              The Ultimate Learning Resource
            </div>

            <h1
              ref={titleRef}
              className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Talks by Gyapak
              </span>
            </h1>

            <h4
              className="text-xl md:text-2xl font-extrabold leading-tight mb-6 tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                ~ the blogs
              </span>
            </h4>

            <div
              ref={featuresRef}
              className="mb-6"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-105 border border-purple-300 border-opacity-20">
                <TrendingUp className="h-6 w-6 text-purple-200 mb-3 mx-auto md:mx-0" />
                <h3 className="font-bold text-lg mb-2">Latest Government Exam Trends</h3>
                <p className="text-purple-100 text-sm">Stay ahead with expert insights</p>
              </div>
            </div>

            <Link
              ref={buttonRef}
              to="/blog"
              className="relative inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg shadow-lg hover:from-purple-600 hover:to-indigo-700 transition duration-300 group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 w-1/3 h-full bg-white opacity-10 transform -skew-x-12 group-hover:animate-shine"></span>
              <span className="relative flex items-center">
                Explore Articles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>

            <div className="mt-6 flex items-center justify-center md:justify-start space-x-1 text-purple-200 text-sm">

              <span>Join <span className="font-bold text-white">thousands</span> of students already achieving exam success</span>
            </div>
          </div>

          {/* Right Side - Current Affairs Promotion */}
          <div className="md:w-1/2 text-center md:text-left md:border-l md:pl-8 border-purple-300 border-opacity-30">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-teal-100 bg-opacity-20 backdrop-blur-sm text-teal-100 text-sm font-medium mb-6 border border-teal-300 border-opacity-30">
              <span className="pulse-animation mr-2 w-2 h-2 bg-teal-300 rounded-full"></span>
              Just Launched
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-white">
                Current Affairs
              </span>
            </h2>

            <h4 className="text-xl md:text-2xl font-bold mb-6 text-teal-100">
              Day-to-day Updates for Exam Success
            </h4>

            <div className="grid gap-4 mb-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl border border-teal-300 border-opacity-20 flex items-start">
                <Newspaper className="h-6 w-6 text-teal-200 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Daily News Digest</h3>
                  <p className="text-teal-100 text-sm">Curated news summaries relevant for all government exams</p>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl border border-teal-300 border-opacity-20 flex items-start">
                <Calendar className="h-6 w-6 text-teal-200 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Updated Every Day</h3>
                  <p className="text-teal-100 text-sm">Fresh content to keep you consistently informed</p>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl border border-teal-300 border-opacity-20 flex items-start">
                <Globe className="h-6 w-6 text-teal-200 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">National & Global Coverage</h3>
                  <p className="text-teal-100 text-sm">Complete coverage of all exam-relevant developments</p>
                </div>
              </div>
            </div>

            {/* <Link
              to="/current-affair"
              className="relative inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-lg shadow-lg hover:from-teal-600 hover:to-emerald-700 transition duration-300 group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 w-1/3 h-full bg-white opacity-10 transform -skew-x-12 group-hover:animate-shine"></span>
              <span className="relative flex items-center">
                Explore Current Affairs
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link> */}
          </div>
        </div>

        {/* Adding some decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-400 rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute top-1/2 right-0 w-40 h-40 bg-teal-400 rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute -bottom-20 left-1/3 w-60 h-60 bg-indigo-400 rounded-full filter blur-3xl opacity-10"></div>
        </div>
      </section>
    </>
  );
};

export default GyapakBlogBanner;