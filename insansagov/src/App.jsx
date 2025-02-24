import PageLinks from "./PageLinks";
import React from 'react';
import { Helmet } from "react-helmet-async";

const App = () => {
  return (
<>
<Helmet>
        <title>Gyapak</title>
        <meta name="description" content="Gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
        <meta name="keywords" content="government exams, exam dates, admit cards, results, central government jobs, state government jobs, competitive exams, government jobs" />
        <meta property="og:title" content="Gyapak" />
        <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
      </Helmet>
    <div>
      <PageLinks/>
    </div>
    </>
  )
}

export default App
