import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Component/LoginPage/LoginPage';
import FirstPage from './Component/FirstPage/FirstPage';
import SignUpPageStep1 from './Component/SignUpPageStep1/SignUpPageStep1';
import SignUpPageStep2 from './Component/SignUpPageStep2/SignUpPageStep2';
import DashBoard from './Component/DashBoard/DashBoard';
import Profile from './Component/Profile/Profile';
import EditProfile from './Component/EditProfile/EditProfile';
import './App.css'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('token') ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<FirstPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-step-1" element={<SignUpPageStep1 />} />
        <Route path="/signup-step-2" element={<SignUpPageStep2 />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Routes>
    </Router>

  )
}

export default App;
