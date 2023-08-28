import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Signup() {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState('');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    //HELPER Functions
    const isUsernameValid = (username) => {
        // Check for no whitespace, and at least 3 characters
        const hasWhitespace = /\s/.test(username);
        const hasMinLength = username.length >= 3;

        const errors = [];
        if (hasWhitespace) {
            errors.push('cannot have white space');
        }
        if (!hasMinLength) {
            errors.push('must have at least 3 characters');
        }

        const errorMessage = errors.length > 0
        ? `Invalid Username: ${errors.length > 1 ? errors.slice(0, -1).join(', ') + ', and' : ''} ${errors.slice(-1)}`
        : '';

        return {
            valid: errors.length === 0,
            errorMessage: errorMessage
        };
    };
    const isPasswordValid = (password) => {
        // Check for at least 8 characters, an uppercase letter, a lowercase letter, a number, and no whitespace
        const hasWhitespace = /\s/.test(password);
        const hasMinLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        const errors = [];
        if (hasWhitespace) {
            errors.push('cannot have white space');
        }
        if (!hasMinLength) {
            errors.push('must have at least 8 characters');
        }
        if (!hasUppercase) {
            errors.push('must have an uppercase letter');
        }
        if (!hasLowercase) {
            errors.push('must have a lowercase letter');
        }
        if (!hasNumber) {
            errors.push('must have a number');
        }

        const errorMessage = errors.length > 0
        ? `Invalid Password: ${errors.length > 1 ? errors.slice(0, -1).join(', ') + ', and' : ''} ${errors.slice(-1)}`
        : '';

        return {
            valid: errors.length === 0,
            errorMessage: errorMessage
        };
    };

    //API Calls
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setUsernameError('');
        setPasswordError('');

        const usernameValidation = isUsernameValid(username);
        const passwordValidation = isPasswordValid(password);

        if(!usernameValidation.valid) {
            setUsernameError(usernameValidation.errorMessage);
        }
        if (!passwordValidation.valid) {
            setPasswordError(passwordValidation.errorMessage);
        }
        if (usernameValidation.valid && passwordValidation.valid) {
            try {
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.status === 201) {
                    history.push({
                        pathname: '/login',
                        state: { successMessage: 'Account created successfully! You can now log in.' }
                    });
                } else if (response.status === 409) {
                    setUsernameError(data.message);
                } else if (response.status === 503) {
                    setErrorMessage(data.message);
                }
            } catch (err) {
                setErrorMessage('An error occurred during signup: ' + err);
            }
        }
    };

    return (
        <div className="content">
            <h2>Create an Account</h2>
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
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit" className='editButton'>Create Account</button>
            </form>
            <div className='red'>
                {usernameError} <br />
                {passwordError} <br />
                {errorMessage}
            </div>
        </div>
    );
}

export default Signup;