// PageLinks.jsx
import React from "react";
import {
  Routes,
  BrowserRouter as Router,
  Route,
  Navigate,
} from "react-router-dom";
import DataInsertion from "./Pages/DataInsertion";
import AdminBlogPage from "./Components/BlogPage/AdminBlogPage";
import Login from "./Components/Auth/Login";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import AdminProtectedRoute from "./Components/Auth/AdminProtectedRoute";
import { useAuth } from "./Components/Auth/AuthContext";
import TrackNewUpdates from "./Pages/TrackNewUpdates";
import Navbar from "./Components/Navbar/Navbar"; // ⬅️ move import here
import SeoTools from "./Pages/SEO/SeoTools";
import UserLogsComponent from "./Pages/userLogs/userLogs";
import ThemeAdmin from "./Pages/SiteSettings/ThemeAdmin";

const PageLinks = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <Router>
      {/* ⬇️ Now Navbar (and its <Link>) are inside Router */}
      <Navbar />

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={login} />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DataInsertion />
            </ProtectedRoute>
          }
        />
        <Route path="/site-setting" element={<ThemeAdmin />} />

        <Route
          path="/post-blog"
          element={
            <ProtectedRoute>
              <AdminBlogPage />
            </ProtectedRoute>
          }
        />

        <Route path="/magic-created" element={<TrackNewUpdates />} />

        {/* catch-all */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/seo-tools" element={<SeoTools />} />

        <Route
          path="/logs"
          element={
            <AdminProtectedRoute>
              <UserLogsComponent />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default PageLinks;
