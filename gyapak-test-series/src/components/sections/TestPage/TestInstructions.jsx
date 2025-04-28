import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { getEventDetails, updateEventAttempsByUser } from '../../../service/event.service';
import { useNavigate } from 'react-router-dom';

const TestInstructions = () => {
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proctorStatus, setProctorStatus] = useState('idle');
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null); 


  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(window.location.search);
  const examId = queryParams.get("examId");
  const eventId = queryParams.get("eventId");
  const userId = queryParams.get('userId');

  console.log(examId, eventId, userId);
  
  useEffect(() => {
    console.log("🚀 TestInstructions mounted!");

    

    const isElectron = navigator.userAgent.includes('Electron');
    console.log('🧪 isElectron?', isElectron);
    console.log('✅ electronAPI:', window.electronAPI);
    
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await getEventDetails(eventId);
        if (response.status === 200) {
          setExamDetails(response.data);
          console.log(response.data);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.errors?.[0] || err.message;
        setError(errorMessage);
        console.log(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      window.electronAPI?.stopProctorEngine?.();
    };
  }, [eventId]);

  useEffect(() => {
    const handleProctorEvent = (data) => {
      console.log("📥 Proctor Event in TestInstructions:", data);
    
      if (data?.eventType === "session_start" || data?.details?.includes("Face detection normalized")) {
        setProctorStatus('ready');
        if (timeoutId) clearTimeout(timeoutId);
    
        console.log("✅ Session Started! Navigating to TestWindow...");
    
        navigate(`/test-page?userId=${userId}&examId=${examId}&eventId=${eventId}`);
      }
    };
    
  
    if (window?.electronAPI?.onProctorEvent) {
      window.electronAPI.onProctorEvent(handleProctorEvent);
    }
  
    return () => {
      window?.electronAPI?.removeProctorEventListener?.();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, userId, examId, eventId, timeoutId]);
  


const handleStartTest = async () => {
  try {
    if (window.electronAPI && userId && examId && eventId) {
      console.log("🔥  Launching Proctor Engine...");
      window.electronAPI.startProctorEngine(userId, examId, eventId);
      setProctorStatus('starting');

      const updatedAttempt = await updateEventAttempsByUser(eventId, userId);
      if (updatedAttempt.status === 200) {
        console.log(updatedAttempt.data);
      }

      const id = setTimeout(() => {
        setTimeoutReached(true);
      }, 30000);
      setTimeoutId(id); // ✅ save timeout ID
    } else {
      console.warn("❌ Missing required params or electronAPI not available");
      setError("Unable to start the proctor. Please ensure you're using the correct application.");
    }
  } catch (err) {
    console.error("Failed to start test:", err);
  }
};

useEffect(() => {
  const handleProctorEvent = (data) => {
    console.log("📥 Proctor Event in TestInstructions:", data);
    if (data?.eventType === "session_start") {
      setProctorStatus('ready');

      if (timeoutId) {
        clearTimeout(timeoutId); // ✅ clear timeout when session starts
      }

      console.log("✅ Session Started! Navigating to TestWindow...");
      navigate(`/test?userId=${userId}&examId=${examId}&eventId=${eventId}`);
    }
  };

  if (window?.electronAPI?.onProctorEvent) {
    window.electronAPI.onProctorEvent(handleProctorEvent);
  }

  return () => {
    window?.electronAPI?.removeProctorEventListener?.();
    if (timeoutId) clearTimeout(timeoutId); // ✅ also clear when unmount
  };
}, [navigate, userId, examId, eventId, timeoutId]);


  const retryProctor = () => {
    setTimeoutReached(false);
    handleStartTest();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Exam</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // 🛡️ Show nice animated loading when initializing proctor
  if (proctorStatus === 'starting') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-semibold text-purple-700 mb-2 animate-pulse">Initializing Proctor System...</h2>
        <p className="text-gray-600 text-sm mb-8">Please stay calm. Checking your camera and microphone permissions.</p>

        {timeoutReached && (
          <div className="mt-6">
            <p className="text-red-600 mb-4">⚠️ Taking too long? Retry launching proctor manually.</p>
            <button
              onClick={retryProctor}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-semibold transition-colors shadow"
            >
              Retry Starting Proctor
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          {examDetails?.name || `Exam: ${examId}`}
        </h1>
        <p className="text-center text-purple-100">
          {examDetails?.subtitle || "Online Proctored Examination"}
        </p>
      </div>
      
      {/* Exam Details Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-2 border-r border-gray-200 last:border-r-0">
            <p className="text-gray-600 text-sm">Duration</p>
            <p className="font-semibold text-lg">{examDetails?.duration || "120"} min</p>
          </div>
          <div className="p-2 border-r border-gray-200 last:border-r-0">
            <p className="text-gray-600 text-sm">Questions</p>
            <p className="font-semibold text-lg">{examDetails?.questionCount || "50"}</p>
          </div>
          <div className="p-2 border-r border-gray-200 last:border-r-0">
            <p className="text-gray-600 text-sm">Max Score</p>
            <p className="font-semibold text-lg">{examDetails?.maxScore || "100"} pts</p>
          </div>
          <div className="p-2">
            <p className="text-gray-600 text-sm">Passing Score</p>
            <p className="font-semibold text-lg">{examDetails?.passingScore || "60"}%</p>
          </div>
        </div>
      </div>
      
      {/* Main Content - Parallel Layout */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Exam Description */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">Exam Description</h2>
            <p className="text-gray-800">
              {examDetails?.description || "This exam will test your knowledge on the subject matter. Please ensure you're prepared before starting the test."}
            </p>
          </div>
          
          {/* AI Proctoring Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-800 border-b border-blue-200 pb-2">
              AI Proctoring System
            </h2>
            <p className="mb-3">
              When you click "Start Test", the AI proctor will monitor:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Camera for presence detection</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Multiple person detection</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Audio monitoring</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Tab change detection</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Phone detection</p>
              </div>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
              <p className="text-yellow-800 text-sm">
                By proceeding, you consent to the AI proctoring system monitoring your test session.
              </p>
            </div>
          </div>
          
          {/* System Requirements */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">System Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="bg-gray-200 p-1 rounded-full mr-2">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Working webcam</p>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-200 p-1 rounded-full mr-2">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Microphone</p>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-200 p-1 rounded-full mr-2">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Stable internet</p>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-200 p-1 rounded-full mr-2">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Browser permissions</p>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-200 p-1 rounded-full mr-2">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Quiet environment</p>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-200 p-1 rounded-full mr-2">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>No virtual machines</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Examination Guidelines */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">Examination Guidelines</h2>
            
            {/* Session Continuity */}
            <div className="mb-4 flex">
              <div className="flex-shrink-0 mr-3">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Session Continuity</h3>
                <p className="text-gray-600 mb-1 text-sm">
                  If your test closes or network errors occur:
                </p>
                <p className="text-green-700 text-sm font-medium">
                  You can reopen the test twice and your work will be saved.
                </p>
              </div>
            </div>
            
            {/* Proctoring Warnings */}
            <div className="mb-4 flex">
              <div className="flex-shrink-0 mr-3">
                <div className="bg-red-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Proctoring Warnings</h3>
                <p className="text-gray-600 mb-1 text-sm">
                  The AI proctor will issue warnings for suspicious behavior:
                </p>
                <p className="text-red-700 text-sm font-medium">
                  After 5 warnings, your test will be automatically submitted.
                </p>
              </div>
            </div>
            
            {/* Time Limits */}
            <div className="mb-4 flex">
              <div className="flex-shrink-0 mr-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Time Limits</h3>
                <p className="text-gray-600 text-sm">
                  When the time limit is reached, your test will be automatically submitted.
                </p>
              </div>
            </div>
            
            {/* Results */}
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="bg-purple-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Results</h3>
                <p className="text-gray-600 text-sm">
                  Your results will be shown immediately on your account after submission.
                </p>
              </div>
            </div>
          </div>
          
          {/* Additional Important Information */}
          <div className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">Additional Information</h2>
            
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-md shadow-sm">
                <h3 className="font-medium text-gray-800 mb-1">Prohibited Items</h3>
                <p className="text-gray-600 text-sm">
                  Books, notes, secondary devices, and assistance from others are not permitted during the exam.
                </p>
              </div>
              
              <div className="p-3 bg-white rounded-md shadow-sm">
                <h3 className="font-medium text-gray-800 mb-1">Technical Support</h3>
                <p className="text-gray-600 text-sm">
                  If you encounter technical issues, use the support chat button at the bottom-right corner of your screen.
                </p>
              </div>
              
              <div className="p-3 bg-white rounded-md shadow-sm">
                <h3 className="font-medium text-gray-800 mb-1">Privacy</h3>
                <p className="text-gray-600 text-sm">
                  Proctoring data is encrypted and used solely for exam integrity purposes. It is deleted 30 days after completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Agreement and Start Button */}
      <div className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 max-w-xl w-full">
            <label className="flex items-start cursor-pointer">
              <input 
                type="checkbox" 
                className="h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 mt-1"
                checked={guidelinesAccepted}
                onChange={() => setGuidelinesAccepted(!guidelinesAccepted)}
              />
              <span className="ml-2 text-gray-700">
                I have read and understood the examination guidelines, including the AI proctoring system requirements and rules. I consent to be monitored by the proctoring system during my test.
              </span>
            </label>
          </div>
          
          <button
            onClick={handleStartTest}
            disabled={proctorStatus === 'started' || !guidelinesAccepted}
            className={`${
              proctorStatus === 'started' || !guidelinesAccepted
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white px-8 py-3 rounded-md font-medium shadow-md transition-colors text-lg w-64`}
          >
            {proctorStatus === 'started' ? 'Proctor Starting...' : 'Start Test'}
          </button>
          
          {proctorStatus === 'started' && (
            <p className="mt-4 text-sm text-purple-600 animate-pulse">
              Initializing proctor system... Please wait.
            </p>
          )}
          
          {!guidelinesAccepted && (
            <p className="mt-2 text-xs text-gray-500">
              You must accept the guidelines to proceed
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestInstructions;