// src/pages/Content.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Content = () => {
  const [contentList, setContentList] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // 2. Fetch content for the user’s grade
    //    First we need to know the user’s grade; but since Home fetched it,
    //    we can store it in localStorage or re-fetch the profile here.
    //    For simplicity, let’s re-fetch the profile, then fetch content.
    axios
      .get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const grade = res.data.grade;
        return axios.get(`http://localhost:5000/api/content/${grade}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then((res) => {
        setContentList(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch content.');
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
      <h1>Your Grade’s Content</h1>
      {contentList.length === 0 ? (
        <p>No content available for your grade yet.</p>
      ) : (
        <ul>
          {contentList.map((item) => (
            <li key={item._id} style={{ marginBottom: '0.5rem' }}>
              <strong>{item.title}</strong> — {item.description}
              <br />
              <a
                href={`http://localhost:5000/${item.fileUrl.replace(
                  /\\/g,
                  '/'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View / Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Content;
