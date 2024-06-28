import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Component/LoginPage/LoginPage';
import FirstPage from './Component/FirstPage/FirstPage';
import SignupPage from './Component/SignupPage/SignupPage';
import DashBoard from './Component/DashBoard/DashBoard';
import './App.css'


function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<FirstPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </Router>

  )
}

export default App;
