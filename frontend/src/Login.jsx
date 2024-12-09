import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setErrorValue] = useState('');
  const navigate = useNavigate();

  function setUsername(event) {
    const username = event.target.value;
    setUsernameInput(username);
  }

  function setPassword(event) {
    const pswd = event.target.value;
    setPasswordInput(pswd);
  }

  async function submit(e) {
    e.preventDefault();
    setErrorValue('');
    try {
      const response = await axios.post('/api/users/login',
          {
            username: usernameInput,
            password: passwordInput
          },
          { withCredentials: true }
      );

      if (response.data) {
        // Force reload of window after successful login
        navigate('/');
        window.location.reload();
      }
    } catch (e) {
      setErrorValue(e.response?.data || 'Login failed');
    }
  }

  return (
      <div>
        <h1>Login</h1>
        {!!error && <h2>{error}</h2>}
        <form onSubmit={submit}>
          <div>
            <span>Username: </span>
            <input
                type='text'
                value={usernameInput}
                onChange={setUsername}
                required
            />
          </div>
          <div>
            <span>Password: </span>
            <input
                type='password'
                value={passwordInput}
                onChange={setPassword}
                required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
  );
}