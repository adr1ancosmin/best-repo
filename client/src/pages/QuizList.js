// src/pages/QuizList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // First fetch profile to get the grade
    axios
      .get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const grade = res.data.grade;
        // Now fetch quizzes for that grade
        return axios.get(`http://localhost:5000/api/quiz/${grade}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then((res) => {
        setQuizzes(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch quizzes.');
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [navigate]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '1rem auto', padding: '1rem' }}>
      <h1>Available Quizzes</h1>
      {quizzes.length === 0 ? (
        <p>No quizzes available for your grade.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id} style={{ marginBottom: '0.5rem' }}>
              <strong>{quiz.title}</strong> (Created by {quiz.createdBy.name})
              <button
                onClick={() => navigate(`/quiz/${quiz._id}`)}
                style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem' }}
              >
                Take Quiz
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizList;