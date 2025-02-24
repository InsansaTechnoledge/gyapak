import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import { useApi } from '../../Context/ApiContext';

const UnsubscribePage = () => {
    const { apiBaseUrl } = useApi();
    const [unsubscribedmsg, setUnsubscribedMsg] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); // State to show loading during API call
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    useEffect(() => {
        if (!token) {
            handleGoHome();
        }
    }, [token])
    const handleUnsubscribe = async () => {



        if (!token) {
            setErrorMessage('Invalid or missing token.');
            return;
        }

        setIsProcessing(true); // Start loading
        setErrorMessage(''); // Clear any previous error

        try {
            const response = await axios.post(`${apiBaseUrl}/api/subscriber/unsubscribe`, { token });

            if (response.status === 201) {
                setUnsubscribedMsg(response.data);
            }
            else if (response.status === 202) {
                setUnsubscribedMsg(response.data);
            }
            else {
                setErrorMessage(response.data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);

            if (error.response) {
                setErrorMessage(error.response.data.message || 'An error occurred. Please try again.');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } finally {
            setIsProcessing(false); // End loading
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    if (!token) {
        return <div className='w-full h-screen flex justify-center'>
            <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
        </div>
    }

    return (
        <>
            <Helmet>
                <title>gyapak</title>
                <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
                <meta name="keywords" content="government exams, exam dates, admit cards, results, central government jobs, state government jobs, competitive exams, government jobs" />
                <meta property="og:title" content="gyapak" />
                <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
            </Helmet>
            <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
                <h1 className="text-6xl font-bold text-purple-500 mb-4">Unsubscribe</h1>

                {unsubscribedmsg ? (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">{unsubscribedmsg}</h2>
                        <p className="text-lg mb-6">You will no longer receive updates.</p>
                    </>
                ) : (
                    <>
                        {errorMessage ? (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-red-500">Error</h2>
                                <p className="text-lg mb-6 text-red-500">{errorMessage}</p>
                            </>
                        ) : (
                            <p className="text-lg mb-6">Click the button below to confirm your unsubscribe request.</p>
                        )}

                        {!unsubscribedmsg && (
                            <button
                                onClick={handleUnsubscribe}
                                disabled={isProcessing}
                                className={`px-4 py-2 ${isProcessing
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-purple-500 hover:bg-purple-600'
                                    } text-white rounded-lg transition-all`}
                            >
                                {isProcessing ? 'Processing...' : 'Unsubscribe'}
                            </button>
                        )}
                    </>
                )}

                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={handleGoHome}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </>
    );
};

export default UnsubscribePage;
