const express = require('express');
const router = express.Router();
const SafetyVideo = require('../schemas/SafetyVideo');

// GET videos with filtering
router.get('/', async (req, res) => {
  try {
    const {
      category,
      ageRange,
      interests,
      limit = 10,
      skip = 0,
      sortBy = 'views'
    } = req.query;

    let query = { isApproved: true };

    if (category) query.category = category;
    if (ageRange) {
      query['targetAudience.ageRange'] = ageRange;
    }
    if (interests) {
      const interestsArray = interests.split(',');
      query.$or = [
        { 'targetAudience.interests': { $in: interestsArray } },
        { tags: { $in: interestsArray } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = -1; // descending

    const videos = await SafetyVideo.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await SafetyVideo.countDocuments(query);

    res.json({
      videos,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET personalized videos for user
router.get('/personalized/:userId', async (req, res) => {
  try {
    // In a real implementation, you'd fetch user profile first
    // For now, using query params
    const { ageRange, interests, limit = 10 } = req.query;

    const videos = await SafetyVideo.getPersonalizedVideos(
      ageRange,
      interests ? interests.split(',') : null,
      parseInt(limit)
    );

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET popular videos
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const videos = await SafetyVideo.getPopularVideos(limit);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET video by ID
router.get('/:videoId', async (req, res) => {
  try {
    const video = await SafetyVideo.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RECORD video view
router.post('/:videoId/view', async (req, res) => {
  try {
    const { userId, completed = false } = req.body;

    const video = await SafetyVideo.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await video.recordView(userId, completed);
    res.json({ message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD like to video
router.post('/:videoId/like', async (req, res) => {
  try {
    const { userId } = req.body;

    const video = await SafetyVideo.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await video.addLike(userId);
    res.json({ message: 'Like added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new video (admin/AI)
router.post('/', async (req, res) => {
  try {
    const video = new SafetyVideo({
      videoId: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...req.body
    });

    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE video
router.patch('/:videoId', async (req, res) => {
  try {
    const video = await SafetyVideo.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    Object.assign(video, req.body);
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET video statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await SafetyVideo.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          avgDuration: { $avg: '$duration' },
          byCategory: {
            $push: '$category'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        total: 0,
        totalViews: 0,
        totalLikes: 0,
        avgDuration: 0,
        byCategory: {}
      });
    }

    const result = stats[0];
    const byCategory = result.byCategory.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    res.json({
      total: result.total,
      totalViews: result.totalViews,
      totalLikes: result.totalLikes,
      avgDuration: Math.round(result.avgDuration),
      byCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;