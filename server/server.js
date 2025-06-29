const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/househelp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const requestSchema = new mongoose.Schema({
  service: String,
  desc: String,
  status: { type: String, default: 'open' },
  requestedBy: String,
  userId: String,
  acceptedBy: String,
  contact: String,
  userLocation: {
    lat: Number,
    lng: Number
  },
  workerLocation: {
    lat: Number,
    lng: Number
  },
  timestamp: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', requestSchema);

// 📌 Create Request
app.post('/api/request', async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(200).json({ message: 'Request submitted' });
  } catch (err) {
    console.error('Error saving request:', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// 📌 Accept Request
app.post('/api/accept/:id', async (req, res) => {
  const { acceptedBy, workerLocation } = req.body;

  try {
    await Request.findByIdAndUpdate(req.params.id, {
      status: 'accepted',
      acceptedBy,
      workerLocation
    });
    res.status(200).json({ message: 'Request accepted' });
  } catch (err) {
    console.error('Error accepting request:', err);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// 📌 Fetch All Requests
app.get('/api/all-requests', async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// 📌 Fetch Open Requests Only
app.get('/api/requests', async (req, res) => {
  try {
    const openRequests = await Request.find({ status: 'open' });
    res.status(200).json(openRequests);
  } catch (err) {
    console.error('Error fetching open requests:', err);
    res.status(500).json({ error: 'Failed to fetch open requests' });
  }
});

// 📌 Delete Request (After Reached)
app.delete('/api/delete-request/:id', async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Request deleted' });
  } catch (err) {
    console.error('Error deleting request:', err);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
