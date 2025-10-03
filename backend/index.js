import cors from 'cors';
import dotenv from 'dotenv'
import express from 'express';

dotenv.config();

import { getRes } from './src/GeminiVideoAnalyzer.js';
import { ReportAnalyzer } from './src/OtherAiModels.js';
import { ReportModel } from './src/mongodb/ReportAnalyzerSchema.js';
import './src/mongodb/connection.js';
import { HazardDetectionResponseModel } from './src/mongodb/hazardDetectionResponseSchema.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Mongo


// Video ---------------------------------------------------------------------------------------------------------------
// CREATE
app.post('/mongo/report-analyzer', async (req, res) => {
  try {
    const report = new ReportModel(req.body);
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ ALL
app.get('/mongo/report-analyzer', async (req, res) => {
  try {
    const reports = await ReportModel.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ONE by ID
app.get('/mongo/report-analyzer/:id', async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE by ID
app.put('/mongo/report-analyzer/:id', async (req, res) => {
  try {
    const report = await ReportModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!report) return res.status(404).json({ message: 'Not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE (delete report by ID)
app.delete('/mongo/report-analyzer/:id', async (req, res) => {
  try {
    const report = await ReportModel.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET last 20 report entries
app.get('/mongo/report-analyzer/recent', async (req, res) => {
  try {
    const latestReports = await ReportModel.find()
      .sort({ createdAt: -1 })    // Sort by creation date descending (newest first)
      .limit(20);                 // Limit to 20 results
    res.json(latestReports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Video endpoints------------------------------------------------------------------------------------------------------
// CREATE a new hazard detection response
app.post('/mongo/hazard-detection', async (req, res) => {
  try {
    const hazardResponse = new HazardDetectionResponseModel(req.body);
    const savedResponse = await hazardResponse.save();
    res.status(201).json(savedResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all hazard responses
app.get('/mongo/hazard-detection', async (req, res) => {
  try {
    const responses = await HazardDetectionResponseModel.find();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ one response by ID
app.get('/mongo/hazard-detection/:id', async (req, res) => {
  try {
    const response = await HazardDetectionResponseModel.findById(req.params.id);
    if (!response) return res.status(404).json({ message: 'Not found' });
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a hazard response by ID
app.put('/mongo/hazard-detection/:id', async (req, res) => {
  try {
    const updatedResponse = await HazardDetectionResponseModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedResponse) return res.status(404).json({ message: 'Not found' });
    res.json(updatedResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a hazard response by ID
app.delete('/mongo/hazard-detection/:id', async (req, res) => {
  try {
    const deletedResponse = await HazardDetectionResponseModel.findByIdAndDelete(req.params.id);
    if (!deletedResponse) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Hazard response deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET the last 20 hazard responses (most recent first)
app.get('/mongo/hazard-detection/recent', async (req, res) => {
  try {
    const recentResponses = await HazardDetectionResponseModel.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(recentResponses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Local Alerts---------------------------------------------------------------------------------------------------------
import { LocalAlerts } from './src/mongodb/LocalAlerts.js'
// CREATE
app.post('/local-alerts', async (req, res) => {
  try {
    const alert = new LocalAlerts(req.body);
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ (all )
app.get('/local-alerts', async (req, res) => {
  try {
    const alerts = await LocalAlerts.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ (all future alerts only)
app.get('/local-alerts/active', async (req, res) => {
  try {
    const now = new Date();
    const alerts = await LocalAlerts.find({ date: { $gte: now } }).sort({ date: 1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID
app.get('/local-alerts/:id', async (req, res) => {
  try {
    const alert = await LocalAlerts.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Local alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/local-alerts/:id', async (req, res) => {
  try {
    const updatedAlert = await LocalAlerts.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAlert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete('/local-alerts/:id', async (req, res) => {
  try {
    await LocalAlerts.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// AI endpoints---------------------------------------------------------------------------------------------------------
// Video
app.post('/api/detect', async (req, res) => {
  console.log("/api/detect   ...initialized")

  try {
    const b64_video = req.body.video;
    const response = JSON.parse(await getRes(b64_video))

    if (response.status != 'safe') {
      const hazardResponse = new HazardDetectionResponseModel(await response)
      console.log(await hazardResponse.save());
    }

    if (current.length) { current.pop() }

    current.push(response)
    res.send(await response);
  } catch (error) {
    console.log(error)
    res.send("Error");
  }
})

// image
app.post('/api/report', async (req, res) => {

  console.log("/api/report   ...initialized")

  try {
    const b64_image = req.body.image;
    const response = JSON.parse(await ReportAnalyzer(b64_image, req.body.title, req.body.description, req.body.phone, req.body.location));

    const reportResponse = new ReportModel(await response)
    console.log(await reportResponse.save());

    res.send(await response);
  } catch (error) {
    console.log(error)
    res.send("Error");
  }
});

const PORT=process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))