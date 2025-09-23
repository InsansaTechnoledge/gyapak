import React from 'react'
import PageLinks from './PageLinks'
import Navbar from './Components/Navbar/Navbar'
import { AuthProvider } from './Components/Auth/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <Navbar/>
      <PageLinks />
    </AuthProvider>
  )
}

export default App
