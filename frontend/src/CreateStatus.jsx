import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateStatus() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit() {
    try {
      await axios.post('/api/status/create', { content });
      navigate('/');
    } catch (error) {
      setError(error.response?.data || 'Failed to create status');
    }
  }

  return (
      <div className="create-status-form">
        <h2>Create New Status</h2>
        {error && <div className="error">{error}</div>}
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={280}
        />
        <div className="char-count">
          {280 - content.length} characters remaining
        </div>
        <button onClick={submit}>Post Status</button>

        <style jsx>{`
                .create-status-form {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                }
                textarea {
                    width: 100%;
                    height: 100px;
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 5px;
                }
                .char-count {
                    text-align: right;
                    color: #666;
                }
                button {
                    background: #0066cc;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .error {
                    color: red;
                    margin: 10px 0;
                }
            `}</style>
      </div>
  );
}