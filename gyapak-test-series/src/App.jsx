import React from 'react'
import Landing from './pages/Landing'
import PageLinks from '../PageLinks'
import { UserProvider } from './context/UserContext'

const App = () => {
  return (
    <>
    <UserProvider>
      <PageLinks />
    </UserProvider>
    </>
  )
} 

export default App