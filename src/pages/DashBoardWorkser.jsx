import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardWorker() {
  const [requests, setRequests] = useState([]);
  const [acceptedRequestId, setAcceptedRequestId] = useState(null);

  const workerName = localStorage.getItem('workerName') || 'Worker';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests');
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const acceptRequest = async (id) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        await axios.post(`http://localhost:5000/api/accept/${id}`, {
          acceptedBy: workerName,
          workerLocation: { lat: latitude, lng: longitude }
        });
        setAcceptedRequestId(id);
        fetchRequests(); // Refresh list
      } catch (err) {
        console.error("Error accepting request:", err);
      }
    }, (err) => {
      alert("Please allow location access for accepting request.");
      console.error("Location error:", err);
    });
  };

  const availableRequests = requests.filter(req => req.status === 'open');

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Welcome, {workerName}</h2>

      {acceptedRequestId && (
        <div className="bg-green-100 border border-green-500 text-green-800 p-4 rounded mb-4">
          ✅ You accepted a request. Please contact the user.
        </div>
      )}

      {availableRequests.length === 0 ? (
        <p className="text-gray-500">No open requests at the moment.</p>
      ) : (
        availableRequests.map((req) => (
          <div
            key={req._id}
            className="mb-4 p-4 border rounded shadow bg-white"
          >
            <p><strong>Service:</strong> {req.service}</p>
            <p><strong>Address:</strong> {req.desc}</p>
            <p><strong>Requested By:</strong> {req.requestedBy}</p>
            <p><strong>Contact:</strong> {req.contact}</p>

            <button
              onClick={() => acceptRequest(req._id)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Accept
            </button>
          </div>
        ))
      )}
    </div>
  );
}
