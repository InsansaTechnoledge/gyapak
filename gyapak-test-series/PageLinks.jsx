import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './src/pages/Landing'

const PageLinks = () => {
  return (
    <>
        <Router>
            <Routes>
                <Route path='/' element={<Landing />} />   
            </Routes>    
        </Router>    
    </>
  )
}

export default PageLinks