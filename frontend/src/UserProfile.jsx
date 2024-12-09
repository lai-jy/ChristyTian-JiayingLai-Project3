import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [activeUsername, setActiveUsername] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatusContent, setEditingStatusContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkIfUserIsLoggedIn();
    fetchUserData();
  }, [username]);

  async function checkIfUserIsLoggedIn() {
    try {
      const response = await axios.get('/api/users/isLoggedIn', {
        withCredentials: true
      });
      setActiveUsername(response.data.username);
    } catch (error) {
      console.log('Not logged in');
    }
  }

  async function fetchUserData() {
    try {
      const userResponse = await axios.get(`/api/users/${username}`);
      setUser(userResponse.data);
      setDescription(userResponse.data.description || '');

      const statusResponse = await axios.get(`/api/status/user/${username}`);
      setStatuses(statusResponse.data);
      setError(''); // Clear any existing errors
    } catch (error) {
      setError('Failed to fetch user data');
    }
  }

  async function deleteStatus(statusId) {
    try {
      setError(''); // Clear any existing errors
      await axios.delete(`/api/status/${statusId}`, {
        withCredentials: true
      });
      fetchUserData(); // Refresh the status list
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.response?.data || 'Failed to delete status');
    }
  }

  async function updateDescription() {
    try {
      setError(''); // Clear any existing errors
      await axios.put(`/api/users/${user._id}/description`, { description }, {
        withCredentials: true
      });
      setIsEditing(false);
      fetchUserData(); // Refresh the user data
    } catch (error) {
      console.error('Update description error:', error);
      setError(error.response?.data || 'Failed to update description');
    }
  }

  async function updateStatus(statusId) {
    try {
      setError(''); // Clear any existing errors
      await axios.put(`/api/status/${statusId}`, { content: editingStatusContent }, {
        withCredentials: true
      });
      setEditingStatusId(null); // Reset the editing state
      fetchUserData(); // Refresh the status list
    } catch (error) {
      console.error('Update status error:', error);
      setError(error.response?.data || 'Failed to update status');
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
      <div className="profile-container">
        {error && (
            <div className="error-message">
              {error}
            </div>
        )}

        <h1 className="username">{user.username}</h1>
        <p className="joined-date">Joined: {formatDate(user.createdAt)}</p>

        <div className="description-section">
          <h2>About</h2>
          {activeUsername === username ? (
              isEditing ? (
                  <div>
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="description-input"
              />
                    <div className="button-group">
                      <button onClick={updateDescription}
                              className="save-button">
                        Save
                      </button>
                      <button onClick={() => setIsEditing(false)}
                              className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  </div>
              ) : (
                  <div>
                    <p>{description || 'No description yet.'}</p>
                    <button onClick={() => setIsEditing(true)}
                            className="edit-button">
                      Edit Description
                    </button>
                  </div>
              )
          ) : (
              <p>{description || 'No description yet.'}</p>
          )}
        </div>

        <div className="statuses-section">
          <h2>Status Updates</h2>
          {statuses.map(status => (
              <div key={status._id} className="status-item">
                {editingStatusId === status._id ? (
                    <div>
                <textarea
                    value={editingStatusContent}
                    onChange={(e) => setEditingStatusContent(e.target.value)}
                    className="edit-input"
                />
                      <div className="button-group">
                        <button onClick={() => updateStatus(status._id)}
                                className="save-button">
                          Save
                        </button>
                        <button onClick={() => setEditingStatusId(null)}
                                className="cancel-button">
                          Cancel
                        </button>
                      </div>
                    </div>
                ) : (
                    <div className="status-content-wrapper">
                      <p className="status-content">{status.content}</p>
                      <span className="status-date">
                  {formatDate(status.createdAt)}
                </span>
                      {activeUsername === status.username && (
                          <div className="buttons-wrapper">
                            <button
                                onClick={() => setEditingStatusId(status._id)}
                                className="edit-button"
                            >
                              Edit
                            </button>
                            <button
                                onClick={() => deleteStatus(status._id)}
                                className="delete-button"
                            >
                              Delete
                            </button>
                          </div>
                      )}
                    </div>
                )}
              </div>
          ))}
        </div>

        <style jsx>{`
          .profile-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }

          .error-message {
            background-color: #ffebee;
            color: #c62828;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
          }

          .username {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
          }

          .joined-date {
            color: #666;
            margin-bottom: 2rem;
          }

          .status-item {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          }

          .buttons-wrapper {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }

          .edit-button,
          .delete-button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
          }

          .delete-button {
            background-color: #dc3545;
          }

          .delete-button:hover {
            background-color: #c82333;
          }
        `}</style>
      </div>
  );
}