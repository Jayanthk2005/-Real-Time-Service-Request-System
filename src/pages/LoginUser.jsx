import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function LoginUser({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password) {
      localStorage.setItem('userName', email);
      onLogin();
      navigate('/dashboard-user');
    } else {
      alert("All fields are required");
    }
  };

  return (
    <div
      className="login-background"
    
    >
      <form onSubmit={handleLogin} className="login-form" style={{background: 'linear-gradient(to right,rgb(174, 173, 144),rgb(241, 193, 116))'}}>
        <h2 className="login-title">USER LOGIN</h2>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <br></br>
        <br></br>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <br></br>
        <br></br>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}
