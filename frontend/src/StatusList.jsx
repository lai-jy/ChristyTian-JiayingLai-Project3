import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function StatusList() {
  const [statuses, setStatuses] = useState([]);
  const [activeUsername, setActiveUsername] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkIfUserIsLoggedIn();
    fetchStatuses();
  }, []);

  async function checkIfUserIsLoggedIn() {
    try {
      const response = await axios.get('/api/users/isLoggedIn', {
        withCredentials: true
      });
      console.log('Status list login check:', response.data);
      setActiveUsername(response.data.username);
    } catch (error) {
      console.log('Not logged in:', error);
      setActiveUsername(null);
    }
  }

  async function fetchStatuses() {
    try {
      const response = await axios.get('/api/status/all');
      console.log('Fetched statuses:', response.data);
      setStatuses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log('Failed to fetch statuses:', error);
      setStatuses([]);
    }
  }

  async function submitStatus(e) {
    e.preventDefault();
    if (!newStatus.trim()) return;

    try {
      await axios.post('/api/status/create',
          { content: newStatus },
          { withCredentials: true }
      );
      setNewStatus('');
      fetchStatuses(); // Refresh the list
    } catch (error) {
      setError(error.response?.data || 'Error creating status');
    }
  }

  async function deleteStatus(statusId) {
    try {
      await axios.delete(`/api/status/${statusId}`, {
        withCredentials: true
      });
      fetchStatuses(); // Refresh the list
    } catch (error) {
      console.log('Failed to delete status:', error);
    }
  }

  return (
      <div className="status-list">
        {activeUsername && (
            <div className="create-status">
              <h2>Create New Status</h2>
              {error && <div className="error">{error}</div>}
              <form onSubmit={submitStatus}>
                        <textarea
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            placeholder="What's on your mind?"
                            className="status-input"
                        />
                <button type="submit" className="submit-button">
                  Post Status
                </button>
              </form>
            </div>
        )}

        <div className="statuses">
          {statuses.map(status => (
              <div key={status._id} className="status-item">
                <Link to={`/user/${status.username}`} className="username">
                  {status.username}
                </Link>
                <p className="content">{status.content}</p>
                <span className="timestamp">
                            {new Date(status.createdAt).toLocaleString()}
                        </span>
                {activeUsername === status.username && (
                    <button
                        onClick={() => deleteStatus(status._id)}
                        className="delete-button"
                    >
                      Delete
                    </button>
                )}
              </div>
          ))}
        </div>

        <style jsx>{`
                .status-list {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .create-status {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .status-input {
                    width: 100%;
                    min-height: 100px;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                }
                .submit-button {
                    background: #0066cc;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .error {
                    color: #dc3545;
                    margin-bottom: 10px;
                }
                .status-item {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                }
                .username {
                    color: #0066cc;
                    text-decoration: none;
                    font-weight: bold;
                }
                .content {
                    margin: 10px 0;
                }
                .timestamp {
                    color: #6c757d;
                    font-size: 0.9em;
                }
                .delete-button {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 10px;
                }
            `}</style>
      </div>
  );
}