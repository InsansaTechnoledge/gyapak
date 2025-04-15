import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './src/pages/Landing'
import { checkAuth } from './src/service/auth.service'
import { useUser } from './src/context/UserContext'
import ExamSetupForm from './src/components/sections/adminContentUpload'
import UploadQuestionsForm from './src/components/sections/adminContentUpload/secondPartofFormUpload/uploadForm'
import ExamOverview from './src/components/sections/examOverView/ExamOverview'
import ExamListPage from './src/components/sections/examOverView/ExamListpage'
import ExamPage from './src/pages/ExamPage'
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
          <Route path='/form' element={<ExamSetupForm />} />
          <Route path='/question-upload' element={<UploadQuestionsForm/>} />
         
        </Routes>
      </Router>
    </>
  )
}

export default PageLinks