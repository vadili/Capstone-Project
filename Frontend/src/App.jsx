import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Component/LoginPage/LoginPage';
import FirstPage from './Component/FirstPage/FirstPage';
import SignupPage from './Component/SignupPage/SignupPage';
import './App.css'


function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<FirstPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>

  )
}

export default App;
