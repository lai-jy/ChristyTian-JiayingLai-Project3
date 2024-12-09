import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
    const [activeUsername, setActiveUsername] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        checkIfUserIsLoggedIn();
    }, [location.pathname]); // Re-check on route change

    async function checkIfUserIsLoggedIn() {
        try {
            const response = await axios.get('/api/users/isLoggedIn', {
                withCredentials: true
            });
            console.log('Login check response:', response.data);
            setActiveUsername(response.data.username);
        } catch (error) {
            console.log('Not logged in:', error);
            setActiveUsername(null);
        }
    }

    async function logOutUser() {
        try {
            await axios.post('/api/users/logOut', {}, {
                withCredentials: true
            });
            setActiveUsername(null);
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.log('Logout failed:', error);
        }
    }

    return (
        <div className='header'>
            <Link to="/" className="home-link">Home</Link>
            <div className="user-section">
                {activeUsername ? (
                    <>
                        <Link to={`/user/${activeUsername}`}>{activeUsername}</Link>
                        <button onClick={logOutUser}>Log Out</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>

            <style jsx>{`
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #dee2e6;
                }
                .user-section {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                button {
                    padding: 0.5rem 1rem;
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                a {
                    text-decoration: none;
                    color: #0066cc;
                }
            `}</style>
        </div>
    );
}