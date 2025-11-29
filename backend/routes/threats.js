const express = require('express');
const router = express.Router();
const Threat = require('../schemas/Threat');

// GET all active threats
router.get('/', async (req, res) => {
  try {
    const { country, risk, limit = 20, skip = 0 } = req.query;

    const query = { status: 'active' };
    if (country) query.country = country;
    if (risk) query.risk = risk;

    const threats = await Threat.find(query)
      .sort({ risk: -1, firstReported: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Threat.countDocuments(query);

    res.json({
      threats,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET threat by ID
router.get('/:threatId', async (req, res) => {
  try {
    const threat = await Threat.findOne({ threatId: req.params.threatId });
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }
    res.json(threat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new threat (admin)
router.post('/', async (req, res) => {
  try {
    const threat = new Threat({
      threatId: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...req.body
    });

    const savedThreat = await threat.save();
    res.status(201).json(savedThreat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE threat
router.patch('/:threatId', async (req, res) => {
  try {
    const threat = await Threat.findOne({ threatId: req.params.threatId });
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }

    Object.assign(threat, req.body);
    await threat.save();
    res.json(threat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MARK threat as viewed by user
router.post('/:threatId/view', async (req, res) => {
  try {
    const { userId } = req.body;

    const threat = await Threat.findOne({ threatId: req.params.threatId });
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }

    await threat.markAsRead(userId);
    res.json({ message: 'Threat marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD report to threat
router.post('/:threatId/report', async (req, res) => {
  try {
    const { userId, anonymous = true } = req.body;

    const threat = await Threat.findOne({ threatId: req.params.threatId });
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }

    await threat.addReport(userId, anonymous);
    res.json({ message: 'Report added to threat' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET threats by risk level
router.get('/risk/:level', async (req, res) => {
  try {
    const threats = await Threat.getThreatsByRisk(req.params.level);
    res.json(threats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET threat statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Threat.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byRisk: {
            $push: '$risk'
          },
          byType: {
            $push: '$type'
          },
          byCountry: {
            $push: '$country'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        total: 0,
        byRisk: {},
        byType: {},
        byCountry: {}
      });
    }

    const result = stats[0];

    // Count occurrences
    const byRisk = result.byRisk.reduce((acc, risk) => {
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {});

    const byType = result.byType.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const byCountry = result.byCountry.reduce((acc, country) => {
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    res.json({
      total: result.total,
      byRisk,
      byType,
      byCountry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;