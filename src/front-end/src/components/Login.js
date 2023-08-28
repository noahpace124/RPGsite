import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

function Login() {
    const history = useHistory();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.message);
            return;
        }

        //Success
        const data = await response.json();
        const token = data.token;

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('username', username);
        setUsername('');
        setPassword('');
        history.push('/dashboard');
        } catch (err) {
            setErrorMessage('An error occurred while logging in: ' + err);
        }
    };
    
    return (
        <div className="content">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                <label>Username: </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </div>
                <div>
                <label>Password: </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit" className="editButton">Login</button>
                <Link to="/signup" className="button">Sign Up</Link>
                <div className='red'>
                    {errorMessage}
                </div>
                <div className='green'>
                    {location.state && location.state.successMessage && (
                        <p className="success-message">{location.state.successMessage}</p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Login;