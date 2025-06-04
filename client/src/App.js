// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your page components (we'll create these next)
import Home from './pages/Home';
import Login from './pages/Login';
import Content from './pages/Content';
import QuizList from './pages/QuizList';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/content" element={<Content />} />
        <Route path="/quizzes" element={<QuizList />} />
        {/* Add more routes (e.g., /register, /dashboard) as needed */}
      </Routes>
    </Router>
  );
}

export default App;