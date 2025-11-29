require('dotenv').config();
const mongoose = require('mongoose');
const UserProfile = require('../schemas/User');
const Threat = require('../schemas/Threat');
const SafetyVideo = require('../schemas/SafetyVideo');
const Report = require('../schemas/Report');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/consent-quest');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await UserProfile.deleteMany({});
    await Threat.deleteMany({});
    await SafetyVideo.deleteMany({});
    await Report.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Seed Threats
    const threats = [
      {
        threatId: 'threat_001',
        type: 'romance_fraud',
        title: 'Romance Scam Alert',
        description: 'New pattern: Fake profiles on dating apps promising jobs abroad.',
        risk: 'high',
        location: 'Multiple countries',
        country: 'Kenya',
        aiAnalysis: 'High-risk pattern matches known romance fraud tactics. Advise verifying identities through video calls.',
        affectedUsers: 25,
        reportedCases: 12
      },
      {
        threatId: 'threat_002',
        type: 'momo_reversal',
        title: 'MoMo Reversal Scam',
        description: 'Victims reporting unauthorized transactions after sharing PINs.',
        risk: 'medium',
        location: 'Ghana, Nigeria',
        country: 'Ghana',
        aiAnalysis: 'Common in mobile money apps. Always use official channels and never share PINs.',
        affectedUsers: 45,
        reportedCases: 23
      },
      {
        threatId: 'threat_003',
        type: 'job_scam',
        title: 'Fake Job Offers',
        description: 'Scammers posing as employers requesting upfront payments.',
        risk: 'high',
        location: 'Kenya, Uganda',
        country: 'Kenya',
        aiAnalysis: 'Red flag: Requests for payment before employment. Legitimate jobs don\'t charge fees.',
        affectedUsers: 67,
        reportedCases: 34
      }
    ];

    await Threat.insertMany(threats);
    console.log('✅ Seeded threats');

    // Seed Safety Videos
    const videos = [
      {
        videoId: 'video_001',
        title: 'Recognizing Romance Scams',
        scenario: 'How to spot fake online relationships',
        script: 'Learn the red flags of romance scams...',
        duration: 180,
        category: 'romance_fraud',
        targetAudience: {
          ageRange: '18-24',
          interests: ['Online Dating', 'Social Media']
        },
        tags: ['romance', 'scam', 'dating', 'safety'],
        views: 1250,
        likes: 89,
        language: 'en'
      },
      {
        videoId: 'video_002',
        title: 'Mobile Money Safety',
        scenario: 'Protecting your MoMo transactions',
        script: 'Essential tips for safe mobile money usage...',
        duration: 240,
        category: 'general_safety',
        targetAudience: {
          ageRange: '18-34',
          interests: ['Mobile Money', 'WhatsApp']
        },
        tags: ['mobile money', 'transactions', 'security'],
        views: 2100,
        likes: 156,
        language: 'en'
      }
    ];

    await SafetyVideo.insertMany(videos);
    console.log('✅ Seeded safety videos');

    // Seed Sample User
    const sampleUser = {
      userId: 'sample_user_001',
      ageRange: '18-24',
      interests: ['WhatsApp', 'Instagram', 'Mobile Money'],
      country: 'Kenya',
      safetyScore: 75,
      completedQuests: [
        {
          questId: 'q1',
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          score: 85
        }
      ],
      badges: ['safety_expert'],
      totalXP: 1250
    };

    await UserProfile.create(sampleUser);
    console.log('✅ Seeded sample user');

    // Seed Sample Reports
    const reports = [
      {
        reportId: 'report_001',
        category: 'Harassment',
        description: 'Received threatening messages on WhatsApp after ending relationship.',
        incidentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        location: 'Nairobi',
        platform: 'WhatsApp',
        status: 'under_review',
        priority: 'medium',
        isAnonymous: true
      },
      {
        reportId: 'report_002',
        category: 'Scam/Fraud',
        description: 'Lost 5000 KES to fake job offer requiring payment for "background check".',
        incidentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        location: 'Mombasa',
        platform: 'Other',
        status: 'resolved',
        priority: 'high',
        isAnonymous: false,
        reporterId: 'sample_user_001'
      }
    ];

    await Report.insertMany(reports);
    console.log('✅ Seeded sample reports');

    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Seeded data summary:');
    console.log(`   - ${threats.length} threats`);
    console.log(`   - ${videos.length} videos`);
    console.log(`   - 1 sample user`);
    console.log(`   - ${reports.length} reports`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding
connectDB().then(() => {
  seedData();
});