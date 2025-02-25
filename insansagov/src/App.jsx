import PageLinks from "./PageLinks";
import React from 'react';
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from 'react';
import { CheckServer, setApiBaseUrl} from "./Pages/config";



const App = () => {
// const [confirmUrl, setconfirmUrl] = useState(null);
// const [error, setError] = useState(null);


//   useEffect(() => {
//     async function findWorkingApiBaseUrl () {
 
//       try {
//         const url = await CheckServer();
//         if (url){
      
//         setconfirmUrl(url);
//         setApiBaseUrl(url)
//         }
//         else{
//           setError("🚨 No API servers are available!");
//         }

//       } catch (err) {
//         console.error('Error in initializing server:', err);
//         setError("🚨 No API servers are available!");
//       }
  
//   }
//     findWorkingApiBaseUrl();
//   }, []);

//   if (!confirmUrl && !error) return <h2>🔄 Checking API Availability...</h2>;
//   if (error) return <h2>❌ {error}</h2>;
  return (
    <>

      <Helmet>
        <title>gyapak</title>
        <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
        <meta name="keywords" content="government exams, exam dates, admit cards, results, central government jobs, state government jobs, competitive exams, government jobs" />
        <meta property="og:title" content="gyapak" />
        <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
      </Helmet>
      <div>
        <PageLinks />
      </div>
    </>
  )
}

export default App
 