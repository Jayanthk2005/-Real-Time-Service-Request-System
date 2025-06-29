import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';


export default function LoginWorker({ onLogin }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const finalName = name || user.displayName || 'Worker';
      localStorage.setItem('workerName', finalName);
      onLogin();
      navigate('/dashboard-worker');
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      alert("Google Sign-In failed: " + error.message);
    }
  };

  return (
    <div
      className="login-background"
      
    >
      <div className="login-form">
        <h2 className="login-title">WORKER LOGIN</h2>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="login-input" style={{width:'500px',border:'2px solid black'}}
        />
        <br></br>
        <button onClick={handleGoogleLogin} className="login-button google-button">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
