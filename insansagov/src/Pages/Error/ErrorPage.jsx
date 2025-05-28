import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ErrorPage = ({ code, message, subMessage }) => {



    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/government-jobs-after-12th');
    };

    const handleContactUs = () => {
        navigate('/government-jobs-after-12th#contact')

        // setTimeout(() => {
        //     const contactSection = document.getElementById('contact');
        //     if (contactSection) {
        //         contactSection.scrollIntoView({ behavior: 'smooth' });
        //     }
        // }, 100); // Delay may need tuning based on load/render time
    }


    return (
        <>
            <Helmet>
                <title>Oops! Something went wrong</title>
                <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
                <meta name="keywords" content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams" />
                <meta property="og:title" content="gyapak" />
                <meta property="og:description" content="Error page to handle errors of gyapak if anything goes wrong" />
            </Helmet>
            <div className="relative flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
                <h1 className="text-6xl font-bold text-purple-500 mb-4">{code}</h1>
                <h2 className="text-2xl font-semibold mb-4">{message}</h2>
                <p className="text-lg mb-6">
                    {subMessage}
                </p>
                <div className="flex space-x-4">
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
                    >
                        Go to Home
                    </button>
                </div>
                <div className='flex flex-col justify-center gap-2 absolute bottom-20 text-lg'>
                    <span>
                        Having trouble? We're here to help you!
                    </span>

                    <button
                        onClick={handleContactUs}
                        className="px-4 py-2 bg-purple-500 w-fit mx-auto hover:bg-purple-600 text-white rounded-lg transition-all"
                    >
                        Contact Us
                    </button>
                </div>
            </div>

        </>
    );
};

export default ErrorPage;
