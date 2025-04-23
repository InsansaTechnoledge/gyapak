import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './src/pages/Landing'
import { checkAuth } from './src/service/auth.service'
import { useUser } from './src/context/UserContext'
import ExamSetupForm from './src/components/sections/adminContentUpload'
import UploadQuestionsForm from './src/components/sections/adminContentUpload/secondPartofFormUpload/uploadForm'
import ExamPage from './src/pages/ExamPage'
import InstitutePage from './src/pages/ForEducatorPage'
import TestPage from './src/pages/TestPage'
import TestInstructions from './src/components/sections/TestPage/TestInstructions'
import ResultPage from './src/pages/ResultPage'

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
        console.log(err.response.data.errors[0] || err.message);
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
          <Route path="/exam/*" element={<ExamPage />} />
          <Route path="/institute/*" element={<InstitutePage />} />
          <Route path='/form' element={<ExamSetupForm />} />
          <Route path='/question-upload' element={<UploadQuestionsForm/>} />
          <Route path='/test-page' element={<TestPage /> } />
          <Route path='/test' element={<TestInstructions /> } />
          <Route path='/result/:eventId' element={ <ResultPage /> } />

        </Routes>
      </Router>
    </>
  )
}

export default PageLinks