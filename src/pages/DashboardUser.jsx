import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

export default function DashboardUser() {
  const [service, setService] = useState('');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userRequest, setUserRequest] = useState(null);
  const [mobile, setMobile] = useState(localStorage.getItem('userMobile') || '');
  const userName = localStorage.getItem('userName') || 'User';
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequest();
  }, []);

  const fetchRequest = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/all-requests');
      const found = res.data.find(
        req => req.userId === userName && (req.status === 'open' || req.status === 'accepted')
      );
      if (found) {
        setUserRequest(found);
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error fetching user request', err);
    }
  };

  const handleMobileSave = () => {
    if (!mobile) {
      alert('Please enter your mobile number.');
      return;
    }
    localStorage.setItem('userMobile', mobile);
    alert('✅ Mobile number saved successfully.');
  };

  const requestHelp = async (e) => {
    e.preventDefault();
    if (!service || !desc) {
      alert("All fields are required.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        await axios.post('http://localhost:5000/api/request', {
          service,
          desc,
          status: 'open',
          userId: userName,
          requestedBy: userName,
          contact: mobile,
          userLocation: { lat: latitude, lng: longitude },
        });
        setSubmitted(true);
        fetchRequest();
      } catch (error) {
        alert("❌ Failed to submit request.");
        console.error(error);
      }
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // in km
  };

  const handleReached = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-request/${userRequest._id}`);
      setSubmitted(false);
      setUserRequest(null);
    } catch (err) {
      console.error('Error resetting request', err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Welcome, {userName}</h2>

      <div className="mb-4" >
        <input 
          type="tel"
          placeholder="Enter your Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={{width:'600px',border:'2px solid black',background: 'linear-gradient(to right,rgb(207, 213, 228),rgb(246, 245, 245))'}}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <br>
        </br>
        <button
          onClick={handleMobileSave}
          className="mt-2 bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700"
        >
          Save Mobile
        </button>
      </div>

      {!submitted && (
        <form onSubmit={requestHelp} className="space-y-4"  style={{background: 'linear-gradient(to right,rgb(194, 205, 239),rgb(237, 165, 169))'}}>
            <h2 style={{marginLeft:'180px'}}>Choose Service</h2>
          <select
            className="w-full px-4 py-2 border rounded"
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">-- Select Service --</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Cleaning">Cleaning</option>
          </select>
            <h2 style={{marginLeft:'200px'}}>Address</h2>
          <textarea
            placeholder="Your Address..."
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>
      )}

      {submitted && userRequest && userRequest.status !== 'accepted' && (
        <p className="mt-4">Your request has been submitted. Waiting for a worker to accept...</p>
      )}

      {userRequest && userRequest.status === 'accepted' && (
        <>
          <div className="bg-blue-100 p-4 mb-4 rounded border border-blue-300 text-blue-900">
            <strong>{userRequest.acceptedBy}</strong> accepted your <strong>{userRequest.service}</strong> request and he will reach soon.
          </div>

          {userRequest.userLocation && userRequest.workerLocation && (
            <div className="mt-4 h-[400px]">
              <MapContainer
                center={[userRequest.userLocation.lat, userRequest.userLocation.lng]}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[userRequest.userLocation.lat, userRequest.userLocation.lng]} icon={redIcon} />
                <Marker position={[userRequest.workerLocation.lat, userRequest.workerLocation.lng]} icon={redIcon} />
                <Polyline
                  positions={[
                    [userRequest.userLocation.lat, userRequest.userLocation.lng],
                    [userRequest.workerLocation.lat, userRequest.workerLocation.lng]
                  ]}
                  color="blue"
                />
              </MapContainer>
              <p className="mt-2 text-center font-medium">
                Distance: {calculateDistance(
                  userRequest.userLocation.lat,
                  userRequest.userLocation.lng,
                  userRequest.workerLocation.lat,
                  userRequest.workerLocation.lng
                )} km
              </p>
            </div>
          )}

          <button
            onClick={handleReached}
            className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Reached
          </button>
        </>
      )}
    </div>
  );
}
