import React from 'react'
import {Routes, BrowserRouter as Router, Route} from 'react-router-dom';
import DataInsertion from './Pages/DataInsertion';

const PageLinks = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<DataInsertion />} />
        </Routes>
    </Router>
    // <div>pageLinks</div>
  )
}

export default PageLinks