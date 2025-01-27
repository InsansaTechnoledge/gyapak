import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); 
    };

    const handleGoHome = () => {
        navigate('/'); 
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
            <h1 className="text-6xl font-bold text-purple-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Oops! Page Not Found</h2>
            <p className="text-lg mb-6">
                The page you’re looking for doesn’t exist or has been moved.
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
        </div>
    );
};

export default ErrorPage;
