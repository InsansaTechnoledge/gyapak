import React from 'react'
import {Routes, BrowserRouter as Router, Route, Navigate} from 'react-router-dom';
import DataInsertion from './Pages/DataInsertion';
import AdminBlogPage from './Components/BlogPage/AdminBlogPage';
import Login from './Components/Auth/Login';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import { useAuth } from './Components/Auth/AuthContext';

const PageLinks = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <Router>
        <Routes>
            <Route 
              path='/login' 
              element={
                isAuthenticated ? 
                  <Navigate to="/" replace /> : 
                  <Login onLogin={login} />
              } 
            />
            <Route 
              path='/' 
              element={
                <ProtectedRoute>
                  <DataInsertion />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/post-blog' 
              element={
                <ProtectedRoute>
                  <AdminBlogPage />
                </ProtectedRoute>
              } 
            />
            {/* Redirect any unknown routes to home if authenticated, login if not */}
            <Route 
              path='*' 
              element={
                isAuthenticated ? 
                  <Navigate to="/" replace /> : 
                  <Navigate to="/login" replace />
              } 
            />
        </Routes>
    </Router>
  )
}

export default PageLinks