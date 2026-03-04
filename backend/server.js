// Load environment variables
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve videos
const videosDir = path.join(__dirname, 'output_videos');
app.use('/output_videos', express.static(videosDir));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Schema
const violationSchema = new mongoose.Schema({
  imageUrl: String,
  violationType: String,
  analyzedAt: Date,
  videoFilename: String,
  noHelmet: Number,
  tripling: Number,
  phoneUsage: Number,
});
const Violation = mongoose.model('Violation', violationSchema, 'violations');



// ✅ GET: all violations with derived violationType if missing
app.get('/api/violations/all', async (req, res) => {
  try {
    const violations = await Violation.find().sort({ analyzedAt: -1 });

    const formatted = violations.map((v) => {
      let derivedType = v.violationType;
      if (!derivedType) {
        if (v.noHelmet > 0) derivedType = "No Helmet";
        else if (v.phoneUsage > 0) derivedType = "Phone Usage";
        else if (v.tripling > 0) derivedType = "Triple Riding";
        else derivedType = "Unknown";
      }

      return {
        _id: v._id,
        imageUrl: v.imageUrl,
        analyzedAt: v.analyzedAt,
        violationType: derivedType,
        noHelmet: v.noHelmet || (derivedType === "No Helmet" ? 1 : 0),
        tripling: v.tripling || (derivedType === "Triple Riding" ? 1 : 0),
        phoneUsage: v.phoneUsage || (derivedType === "Phone Usage" ? 1 : 0),
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('❌ Error fetching all violations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});





// ✅ GET: latest 10 violations with derived violationType if missing
app.get('/api/violations', async (req, res) => {
  try {
    const violations = await Violation.find()
      .sort({ analyzedAt: -1 })
      .limit(10);

    const formatted = violations.map((v) => {
      let derivedType = v.violationType;
      if (!derivedType) {
        if (v.noHelmet > 0) derivedType = "No Helmet";
        else if (v.phoneUsage > 0) derivedType = "Phone Usage";
        else if (v.tripling > 0) derivedType = "Triple Riding";
        else derivedType = "Unknown";
      }

      return {
        _id: v._id,
        imageUrl: v.imageUrl,
        analyzedAt: v.analyzedAt,
        violationType: derivedType,
        noHelmet: v.noHelmet || (derivedType === "No Helmet" ? 1 : 0),
        tripling: v.tripling || (derivedType === "Triple Riding" ? 1 : 0),
        phoneUsage: v.phoneUsage || (derivedType === "Phone Usage" ? 1 : 0),
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('❌ Error formatting violations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});



// ✅ POST: Save new violation
app.post('/api/violations', async (req, res) => {
  try {
    const { imageUrl, label, videoFilename } = req.body;

    let violationType = "Unknown";
    let noHelmet = 0, phoneUsage = 0, tripling = 0;

    if (label === "no_helmet") {
      violationType = "No Helmet";
      noHelmet = 1;
    } else if (label === "phone_usage") {
      violationType = "Phone Usage";
      phoneUsage = 1;
    } else if (label === "triple_riding") {
      violationType = "Triple Riding";
      tripling = 1;
    } else if (label === "wrong_way") {
      violationType = "Wrong Way Driving";
    }

    const newViolation = new Violation({
      imageUrl,
      violationType,
      analyzedAt: new Date(),
      videoFilename,
      noHelmet,
      phoneUsage,
      tripling,
    });

    await newViolation.save();
    res.status(201).json({ message: "Violation saved successfully" });

  } catch (error) {
    console.error('❌ Error saving violation:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ GET: video list
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

// ✅ GET: related photos by videoFilename
app.get('/api/photos', async (req, res) => {
  try {
    const { videoName } = req.query;

    if (!videoName) {
      return res.status(400).json({ message: 'Video name is required' });
    }

    const relatedPhotos = await Violation.find(
      { videoFilename: videoName },
      { imageUrl: 1, violationType: 1, _id: 0 }
    );

    res.json(relatedPhotos);

  } catch (error) {
    console.error('❌ Error fetching related photos:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ GET: Violations filtered by date range
app.get('/api/violations/filter', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate && endDate) {
      filter.analyzedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const violations = await Violation.find(filter).sort({ analyzedAt: -1 });

    const formatted = violations.map(v => ({
      _id: v._id,
      imageUrl: v.imageUrl,
      analyzedAt: v.analyzedAt,
      violationType: v.violationType,
      noHelmet: v.violationType === 'No Helmet' ? 1 : 0,
      tripling: v.violationType === 'Triple Riding' ? 1 : 0,
      phoneUsage: v.violationType === 'Phone Usage' ? 1 : 0,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("❌ Error filtering violations:", error);
    res.status(500).json({ message: "Failed to filter violations" });
  }
});

// ✅ NEW: GET latest 10 violation photos
app.get('/api/photos/latest', async (req, res) => {
  try {
    const latestPhotos = await Violation.find(
      {},
      { imageUrl: 1, violationType: 1, analyzedAt: 1, _id: 0 }
    )
    .sort({ analyzedAt: -1 })
    .limit(10);

    res.json(latestPhotos);
  } catch (error) {
    console.error('❌ Error fetching latest photos:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ NEW: GET all report data for Reports page
app.get('/api/reports/all', async (req, res) => {
  try {
    const reportData = await Violation.find({}, {
      imageUrl: 1,
      violationType: 1,
      analyzedAt: 1,
      _id: 0
    }).sort({ analyzedAt: -1 });

    res.json(reportData);
  } catch (error) {
    console.error('❌ Error fetching report data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
