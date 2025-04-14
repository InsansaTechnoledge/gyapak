import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './src/pages/Landing'
import { checkAuth } from './src/service/auth.service'
import { useUser } from './src/context/UserContext'

const PageLinks = () => {
  const { user, setUser } = useUser();

  useEffect(() => {

    const checkAuthFunction = async () => {
      try {

        const response = await checkAuth();
        if (response.status == 200) {
          setUser(response.data.user);
        }
      }
      catch (err) {
        console.err(response.errors[0] || err.message);
      }
    }

    if (!user) {
      checkAuthFunction();
    }

  }, [])

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