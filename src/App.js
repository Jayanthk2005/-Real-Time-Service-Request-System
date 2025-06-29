// File: househelp-hub/client/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import LoginUser from './pages/LoginUser';
import LoginWorker from './pages/LoginWorker';
import DashboardUser from './pages/DashboardUser';
import DashboardWorker from './pages/DashBoardWorkser';

export default function App() {
  const [userType, setUserType] = useState(null); // 'user' or 'worker'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [acceptedBy, setAcceptedBy] = useState(null);

  const handleLogin = (type) => {
    setUserType(type);
    setIsAuthenticated(true);
  };

  const handleRequestAccepted = (workerName) => {
    setAcceptedBy(workerName);
  };

  return (
    <div className="app">
      <Router>
        <header className="navbar">
          <div className="logo">HouseHelp Hub</div>
          <nav>
            {!isAuthenticated && (
              <>
                <a href="/login-user">User Login</a>
                <a href="/login-worker">Worker Login</a>
              </>
            )}
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login-user" element={<LoginUser onLogin={() => handleLogin('user')} />} />
            <Route path="/login-worker" element={<LoginWorker onLogin={() => handleLogin('worker')} />} />
            <Route
              path="/dashboard-user"
              element={isAuthenticated && userType === 'user' ? <DashboardUser acceptedBy={acceptedBy} /> : <Navigate to="/login-user" />}
            />
            <Route
              path="/dashboard-worker"
              element={isAuthenticated && userType === 'worker' ? <DashboardWorker onAccept={handleRequestAccepted} /> : <Navigate to="/login-worker" />}
            />
          </Routes>
        </main>

        <footer className="footer" style={{background: 'linear-gradient(to right,rgb(35, 32, 32),rgb(84, 78, 74))'}}>
          <p>&copy; 2025 HouseHelp Hub</p>
        </footer>
      </Router>
    </div>
  );
}
