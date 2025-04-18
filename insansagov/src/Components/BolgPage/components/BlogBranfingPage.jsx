import React, { useRef, useEffect } from 'react';
import { ArrowRight, TrendingUp, BookOpen, Award, Clock } from 'lucide-react';
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
        <meta name="keywords" content="government exams, UPSC, SSC, tech trends, study materials, exam preparation, Gyapak" />
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
        className="relative overflow-hidden bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-950 text-white rounded-2xl shadow-2xl p-10 md:p-16 my-8"
      >

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-purple-100 bg-opacity-20 backdrop-blur-sm text-purple-100 text-sm font-medium mb-6 border border-purple-300 border-opacity-30">
              <span className="animate-pulse mr-2 w-2 h-2 bg-purple-300 rounded-full"></span>
              The Ultimate Learning Resource
            </div>
            
            <h1 
              ref={titleRef} 
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Talks by Gyapak
              </span>
            </h1>

            <h4 
              ref={titleRef} 
              className="text-xl md:text-3xl font-extrabold leading-tight mb-6 tracking-tight"
            >
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                ~ the blogs
              </span>
            </h4>
             
            
            <div 
              ref={featuresRef}
              className="grid  gap-6 mb-10"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-105 border border-purple-300 border-opacity-20">
                <TrendingUp className="h-8 w-8 text-purple-200 mb-4 mx-auto" />
                <h3 className="font-bold text-lg mb-2">Latest Government Exam Trends and updates</h3>
                <p className="text-purple-100 text-sm">Stay ahead with expert insights</p>
              </div>
              
            </div>

            <Link
              ref={buttonRef}
              to="/blog"
              className="relative inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg shadow-lg hover:from-purple-600 hover:to-indigo-700 transition duration-300 group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 w-1/3 h-full bg-white opacity-10 transform -skew-x-12 group-hover:animate-shine"></span>
              <span className="relative flex items-center">
                Explore Articles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            
            <div className="mt-8 flex items-center justify-center space-x-1 text-purple-200 text-sm">
              <Clock className="h-4 w-4" />
              <span>Join <span className="font-bold text-white">Large</span> group of students already achieving exam success</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GyapakBlogBanner;

