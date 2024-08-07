import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Component/LoginPage/LoginPage';
import FirstPage from './Component/FirstPage/FirstPage';
import SignUpPageStep1 from './Component/SignUpPageStep1/SignUpPageStep1';
import SignUpPageStep2 from './Component/SignUpPageStep2/SignUpPageStep2';
import DashBoard from './Component/DashBoard/DashBoard';
import Profile from './Component/Profile/Profile';
import EditProfile from './Component/EditProfile/EditProfile';
import Welcome from './Component/Welcome/Welcome';
import CreateInternship from './Component/CreateInternship/CreateInternship';
import SavedLikedInternships from './Component/SavedLikedInternships/SavedLikedInternships';
import Notifications from './Component/Notifications/Notifications';
import RecruiterInternships from './Component/RecruiterInternships/RecruiterInternships';
import AnnouncementPage from './Component/AnnouncementPage/AnnouncementPage';
import EditInternship from './Component/EditInternships/EditInternships';
import CarouselViewerPage from './Component/CarouselViewerPage/CarouselViewerPage';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export const NotificationContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleSetNotifications = (newNotificationsArray) => {
    setNotifications(newNotificationsArray)
  }

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  return (
    <NotificationContext.Provider value={[notifications, handleSetNotifications]}>
      <Router>
        <Routes>
          <Route exact path="/" element={<FirstPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup-step-1" element={<SignUpPageStep1 />} />
          <Route path="/signup-step-2" element={<SignUpPageStep2 setUser={setUser} />} />
          <Route
            path="/welcome"
            element={
              <PrivateRoute>
                <Welcome firstName={user ? user.firstName : 'Guest'} />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-internship"
            element={
              <PrivateRoute>
                <CreateInternship />
              </PrivateRoute>
            }
          />
          <Route
            path="/saved-internships"
            element={
              <PrivateRoute>
                <SavedLikedInternships type="saved" />
              </PrivateRoute>
            }
          />
          <Route
            path="/liked-internships"
            element={
              <PrivateRoute>
                <SavedLikedInternships type="liked" />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/recruiter/internships"
            element={
              <PrivateRoute>
                <RecruiterInternships />
              </PrivateRoute>
            }
          />
          <Route
            path="/announcement"
            element={
              <PrivateRoute>
                <AnnouncementPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-internship"
            element={
              <PrivateRoute>
                <EditInternship />
              </PrivateRoute>
            }
          />
          <Route
            path="/carousel-viewer"
            element={
              <PrivateRoute>
                <CarouselViewerPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </NotificationContext.Provider>
  );
}

export default App;
