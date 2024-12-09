import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function EditStatus() {
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { statusId } = useParams();

  useEffect(() => {
    fetchStatus();
  }, [statusId]);

  async function fetchStatus() {
    try {
      const response = await axios.get(`/api/status/${statusId}`);
      setStatusText(response.data.content);
    } catch (error) {
      setError('Failed to fetch status');
    }
  }

  function handleStatusChange(event) {
    setStatusText(event.target.value);
  }

  async function submitEdit() {
    try {
      await axios.put(`/api/status/${statusId}`, { content: statusText });
      navigate('/');
    } catch (error) {
      setError(error.response.data);
    }
  }

  return (
      <div>
        <h1>Edit Status</h1>
        {!!error && <h3>{error}</h3>}
        <div>
                <textarea
                    value={statusText}
                    onChange={handleStatusChange}
                    placeholder="What's on your mind?"
                    maxLength={280}
                />
        </div>
        <button onClick={submitEdit}>Update Status</button>
      </div>
  );
}