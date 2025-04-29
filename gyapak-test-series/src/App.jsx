import React from 'react'
import Landing from './pages/Landing'
import PageLinks from '../PageLinks'
import { UserProvider } from './context/UserContext'
import { InstituteAuthProvider } from './context/InstitiuteContext'

const App = () => {
  return (
    <>
    <UserProvider>
      <InstituteAuthProvider>
      <PageLinks />
      </InstituteAuthProvider>
    </UserProvider>
    </>
  )
} 

export default App