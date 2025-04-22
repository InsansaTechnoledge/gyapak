import React, { useEffect } from 'react'
import { useUser } from '../../../context/UserContext';
import { getEventDetails } from '../../../service/event.service';

const TestInstructions = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const examId = queryParams.get("examId");
    const eventId = queryParams.get("eventId");
    const userId = queryParams.get('userId');

    console.log('electronApi', window.electronAPI);

    useEffect(() => {
        console.log("✅ electronAPI:", window.electronAPI); // 🔍 LOG HERE
        console.log('🧪 isElectron?', navigator.userAgent.includes('Electron'));
        console.log('✅ electronAPI:', window.electronAPI);
        window.testBridge?.ping?.();
        const fetchEvent = async () => {
            try {
                const response = await getEventDetails(eventId);
                if (response.status === 200) {
                    console.log(response.data);
                }
            } catch (err) {
                console.log(err.response?.data?.errors?.[0] || err.message);
            }
        };

        fetchEvent();

        // Log listener
        if (window?.electronAPI?.onProctorLog) {
            window.electronAPI.onProctorLog((log) => {
                console.log("📥 Proctor Log:", log);
            });
        }

        return () => {
            window.electronAPI?.stopProctorEngine?.(); // Cleanup on unmount
        };
    }, []);

    const handleStartTest = () => {
        if (window.electronAPI && userId && examId && eventId) {
          console.log("🔥 Launching Proctor Engine...");
          window.electronAPI.startProctorEngine(userId, examId, eventId);
        } else {
          console.warn("❌ Missing required params or electronAPI not available");
        }
      };
      

    return (
        <>
            <div>TestInstructions</div>
            <h1 className='text-2xl font-bold text-center'>Exam: {examId}</h1>
            <button
                onClick={handleStartTest}
                className='bg-purple-600 text-white px-4 py-2 rounded-md'>
                Start Test
            </button>
        </>
    );
};

export default TestInstructions;
