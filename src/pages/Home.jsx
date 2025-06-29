import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // import external CSS for styles

export default function Home() {
  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="headline">Welcome to HouseHelp Hub</h1>

        <p className="description">
          <strong>HouseHelp Hub</strong> is a real-time service platform that connects people in need of household services 
          (like plumbing, electrical, carpentry, and more) with verified local workers. No more endless calls — simply post your request, 
          and nearby workers will come to your aid.
        </p>

        <p className="uses">
          🛠️ Users can request help<br />
          📞 Workers receive job alerts<br />
          ⭐ Rate & earn reputation points<br />
          🔐 Fast login with verification<br />
          🧾 Transparent, trackable services
        </p>

       
      </div>
    </div>
  );
}
