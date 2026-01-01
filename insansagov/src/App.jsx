import PageLinks from "./PageLinks";
import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./Themes/ThemeProvider";
// import { useApi } from "./Context/ApiContext";
// import { ThemeProvider } from "./theme/ThemeProvider";

const App = () => {
  // const didLog = useRef(false);
  // const { apiBaseUrl } = useApi();

  const apiBaseUrl = "https://adminpanel.gyapak.in";
  // const apiBaseUrl = 'http://localhost:3000';

  // useEffect(() => {
  //   if (!didLog.current) {
  //     console.log("Thank you for visiting gyapak 💜");
  //     didLog.current = true;
  //   }
  // }, []);

  return (
    <ThemeProvider apiBaseUrl={apiBaseUrl}>
      <div className="min-h-screen">
        <Helmet>
          <title>gyapak</title>
          <meta
            name="description"
            content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!"
          />
          <meta
            name="keywords"
            content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams"
          />
          <meta property="og:title" content="gyapak" />
          <meta
            property="og:description"
            content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs."
          />
        </Helmet>

        <Router>
          <PageLinks />
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
