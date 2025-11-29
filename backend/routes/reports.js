const express = require('express');
const router = express.Router();
const Report = require('../schemas/Report');

// CREATE new report
router.post('/', async (req, res) => {
  try {
    const {
      category,
      description,
      incidentDate,
      location,
      platform,
      evidenceUrls,
      contactInfo,
      reporterId,
      isAnonymous = true
    } = req.body;

    const report = new Report({
      reportId: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reporterId: isAnonymous ? undefined : reporterId,
      isAnonymous,
      category,
      description,
      incidentDate,
      location,
      platform,
      evidenceUrls,
      contactInfo
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all reports (admin only)
router.get('/', async (req, res) => {
  try {
    const { status, category, limit = 50, skip = 0 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET pending reports
router.get('/pending', async (req, res) => {
  try {
    const reports = await Report.getPendingReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET reports by category
router.get('/category/:category', async (req, res) => {
  try {
    const reports = await Report.getReportsByCategory(req.params.category);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user's reports (if not anonymous)
router.get('/user/:userId', async (req, res) => {
  try {
    const reports = await Report.getReportsByUser(req.params.userId);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE report status (admin)
router.patch('/:reportId/status', async (req, res) => {
  try {
    const { status, assignedTo, resolution, resolvedBy } = req.body;

    const report = await Report.findOne({ reportId: req.params.reportId });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    if (assignedTo) report.assignedTo = assignedTo;
    if (resolution) {
      report.resolution = resolution;
      report.resolvedBy = resolvedBy;
      report.resolvedAt = new Date();
    }

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD follow-up note
router.post('/:reportId/notes', async (req, res) => {
  try {
    const { note, adminId } = req.body;

    const report = await Report.findOne({ reportId: req.params.reportId });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.addFollowUpNote(note, adminId);
    res.json(report.followUpNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;