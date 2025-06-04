// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Read the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login
      navigate('/login');
      return;
    }

    // 2. Fetch profile from the backend
    axios
      .get('http://localhost:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch profile. Please log in again.');
        // If unauthorized, force logout
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [navigate]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!user) {
    return <p>Loading your profile…</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '1rem auto', padding: '1rem' }}>
      <h1>Welcome, {user.name}!</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      {user.role === 'student' && <p><strong>Grade:</strong> {user.grade}</p>}
      {user.role === 'parent' && <p><strong>Child ID:</strong> {user.childOf}</p>}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        Logout
      </button>

      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => navigate('/content')}
          style={{ padding: '0.5rem 1rem' }}
        >
          View Content
        </button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => navigate('/quizzes')}
          style={{ padding: '0.5rem 1rem' }}
        >
          View Quizzes
        </button>
      </div>
    </div>
  );
};

export default Home;
