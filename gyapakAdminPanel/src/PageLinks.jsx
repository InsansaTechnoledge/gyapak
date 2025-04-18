import React from 'react'
import {Routes, BrowserRouter as Router, Route} from 'react-router-dom';
import DataInsertion from './Pages/DataInsertion';
import AdminBlogPage from './Components/BlogPage/AdminBlogPage';

const PageLinks = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<DataInsertion />} />
            <Route path='/post-blog' element={<AdminBlogPage />} />

        </Routes>
    </Router>
    // <div>pageLinks</div>
  )
}

export default PageLinks