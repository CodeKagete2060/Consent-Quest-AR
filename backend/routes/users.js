const express = require('express');
const router = express.Router();
const UserProfile = require('../schemas/User');

// GET user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await UserProfile.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE or UPDATE user profile
router.post('/:userId', async (req, res) => {
  try {
    const { ageRange, interests, country, safetyScore } = req.body;

    const user = await UserProfile.findOneAndUpdate(
      { userId: req.params.userId },
      {
        ageRange,
        interests,
        country,
        safetyScore,
        lastActive: new Date()
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE safety score
router.patch('/:userId/safety-score', async (req, res) => {
  try {
    const { safetyScore } = req.body;
    const user = await UserProfile.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.updateSafetyScore(safetyScore);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user's completed quests
router.get('/:userId/quests', async (req, res) => {
  try {
    const user = await UserProfile.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.completedQuests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD completed quest
router.post('/:userId/quests', async (req, res) => {
  try {
    const { questId, score } = req.body;
    const user = await UserProfile.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if quest already completed
    const existingQuest = user.completedQuests.find(q => q.questId === questId);
    if (existingQuest) {
      return res.status(400).json({ message: 'Quest already completed' });
    }

    user.completedQuests.push({ questId, score, completedAt: new Date() });
    await user.save();

    res.json(user.completedQuests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET users by country (for analytics)
router.get('/country/:country', async (req, res) => {
  try {
    const users = await UserProfile.getUsersByCountry(req.params.country);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;