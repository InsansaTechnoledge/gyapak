import PageLinks from "./PageLinks";
import React , {useEffect} from 'react';
import { Helmet } from "react-helmet-async";
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {

  let count = 1
  useEffect(() => {
    if(count === 1) {
    console.log('Thank you for visiting gyapak 💜');
    }
    count++;
  }, []);
  return (
    <>
      <Helmet>
        <title>gyapak</title>
        <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
        <meta name="keywords" content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams"/>
        <meta property="og:title" content="gyapak" />
        <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
      </Helmet>

      <Router>
        <PageLinks />
      </Router>
    </>
  );
};

export default App;
