
// At the top
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve videos
const videosDir = path.join(__dirname, 'output_videos');
app.use('/output_videos', express.static(videosDir));

// MongoDB Connection
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://nt03625:mzRewbYxcaNBVX3A@clusterdb.ycdxi.mongodb.net/traffic_violation?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// MongoDB Schema
const violationSchema = new mongoose.Schema({
  imageUrl: String,
  violationType: String,
  analyzedAt: Date,
});
const Violation = mongoose.model('Violation', violationSchema, 'violations');

// ✅ API to fetch only latest 5 violations
app.get('/api/violations', async (req, res) => {
  try {
    const violations = await Violation.find()
      .sort({ analyzedAt: -1 })
      .limit(5);
    res.json(violations);
  } catch (error) {
    console.error('❌ Error fetching violations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Existing API to save violations
app.post('/api/violations', async (req, res) => {
  try {
    const { imageUrl, label } = req.body;

    let violationType = "Unknown";

    if (label === "no_helmet") {
      violationType = "No Helmet";
    } else if (label === "phone_usage") {
      violationType = "Phone Usage";
    } else if (label === "triple_riding") {
      violationType = "Triple Riding";
    } else if (label === "wrong_way") {
      violationType = "Wrong Way Driving";
    }

    const newViolation = new Violation({
      imageUrl,
      violationType,
      analyzedAt: new Date()
    });

    await newViolation.save();
    res.status(201).json({ message: "Violation saved successfully" });

  } catch (error) {
    console.error('❌ Error saving violation:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// API to fetch video list
app.get('/api/videos', (req, res) => {
  fs.readdir(videosDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read videos folder' });
    }
    const videoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp4', '.mov', '.webm', '.mkv', '.avi'].includes(ext);
    });

    const videoUrls = videoFiles.map(file => ({
      name: file,
      url: `http://localhost:${port}/output_videos/${file}`
    }));

    res.json(videoUrls);
  });
});

// ✅ ✅ New API to fetch photos related to a video
app.get('/api/photos', async (req, res) => {
  try {
    const { videoName } = req.query;

    if (!videoName) {
      return res.status(400).json({ message: 'Video name is required' });
    }

    // Extract date and time from video filename
    const match = videoName.match(/violation_(\d{8})-(\d{6})/);
    if (!match) {
      return res.status(400).json({ message: 'Invalid video name format' });
    }

    const datePart = match[1]; // 20250421
    const timePart = match[2]; // 214125

    // Convert to Date object
    const videoDateTime = new Date(
      `${datePart.substring(0, 4)}-${datePart.substring(4, 6)}-${datePart.substring(6, 8)}T${timePart.substring(0, 2)}:${timePart.substring(2, 4)}:${timePart.substring(4, 6)}Z`
    );

    // Set 10 seconds before and after
    const startTime = new Date(videoDateTime.getTime() - 10 * 1000);
    const endTime = new Date(videoDateTime.getTime() + 10 * 1000);

    // Find violations within the time range
    const relatedPhotos = await Violation.find({
      analyzedAt: { $gte: startTime, $lte: endTime }
    });

    res.json(relatedPhotos);

  } catch (error) {
    console.error('❌ Error fetching related photos:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

