import React, { useState } from 'react';

import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://sgebackend.onrender.com/api/login/', { // Adjust the URL to match your backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent with the request if using sessions
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Assuming the response contains a JWT token
        const { token } = data;
  
        if (token) {
          // Save the JWT token to localStorage or sessionStorage
          localStorage.setItem('authToken', token);
          console.log('Login successful, navigating to SGE page');
            // Redirect to the URL after login
            window.location.href = 'https://bellapacx.github.io/Sge/';
        } else {
          console.log('No token received');
          setError('Login failed, no token received');
        }
      } else {
        console.log('Login failed:', data.error);
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred. Please try again.');
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span className="icon">&#128100;</span>
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="icon">&#128274;</span>
          </div>
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className= "button">Login</button>
          
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
