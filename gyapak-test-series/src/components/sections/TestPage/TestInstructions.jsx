import React, { useEffect } from 'react'
import { useUser } from '../../../context/UserContext';
import { getEventDetails } from '../../../service/event.service';

const TestInstructions = () => {

    const queryParams = new URLSearchParams(window.location.search);
    const examId = queryParams.get("examId");
    const eventId = queryParams.get("eventId");
    const {user} = useUser();

    useEffect(() => {
        
        const fetchEvent = async () => {
            try{

                const response = await getEventDetails(eventId);
                if(response.status==200){
                    console.log(response.data);
                }
            }
            catch(err){
                console.log(err.response.data.errors[0] || err.message);
            }

        }

        fetchEvent();

        return () => {
          window.electronAPI?.stopProctorEngine?.();
        };
      }, []);

    const handleStartTest = () => {
        try{
            console.log("JH");
            console.log(user._id, examId, eventId, window);
            // if (window?.electronAPI && user?._id && examId && eventId) {
            //     window.electronAPI.startProctorEngine(user._id, examId, eventId);
            // }
            // else{
            //     console.log("HH");
            // }
        }
        catch(err){
            console.log(err);
        }
    }

  return (
    <>
        <div>TestInstructions</div>
        <h1 className='text-2xl font-bold text-center'></h1>
        <button 
        onClick={handleStartTest}
        className='bg-purple-600 text-white px-4 py-2 rounded-md'>Start Test</button>
    </>
  )
}

export default TestInstructions