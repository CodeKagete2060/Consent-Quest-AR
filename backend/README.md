# Consent Quest Backend API

MongoDB backend for the Consent Quest: Safety Sentinel application.

## 🚀 Features

- **User Profiles**: Store and manage user information, progress, and safety scores
- **Threat Reports**: Anonymous incident reporting system with admin management
- **Safety Videos**: AI-generated educational content with personalization
- **Threat Database**: Real-time threat monitoring and analysis
- **Analytics**: User behavior and safety metrics tracking
- **Rate Limiting**: API protection against abuse
- **Authentication**: JWT-based user authentication
- **Data Seeding**: Pre-populated database for testing
- **API Integration**: Frontend service for easy backend connection

## 📋 Prerequisites

- Node.js 16+
- MongoDB 5.0+
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/consent-quest
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Seed the database (optional):**
   ```bash
   npm run seed  # Populate with sample data
   ```

6. **Start the server:**
   ```bash
   npm run dev  # Development with auto-reload
   # or
   npm start    # Production
   ```

## 🌱 Data Seeding

Pre-populate your database with sample data for testing:

```bash
npm run seed
```

This creates:
- Sample user profiles
- Mock threat data
- Safety video content
- Test reports

## 🔌 Frontend Integration

Use the provided API service in your frontend:

```javascript
import { apiService } from './services/apiService';

// Get user profile
const profile = await apiService.getUserProfile('user123');

// Update safety score
await apiService.updateSafetyScore('user123', 85);

// Get personalized videos
const videos = await apiService.getPersonalizedVideos('user123', '18-24', ['WhatsApp', 'Instagram']);
```

Set the API URL in your environment:
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

### Collections

#### 1. User Profiles (`userprofiles`)
```javascript
{
  userId: String (unique),
  ageRange: String (enum),
  interests: [String],
  country: String (enum),
  safetyScore: Number (0-100),
  completedQuests: [{
    questId: String,
    completedAt: Date,
    score: Number
  }],
  badges: [{
    badgeId: String,
    unlockedAt: Date
  }],
  totalXP: Number,
  reportedThreats: [{
    threatId: String,
    reportedAt: Date,
    category: String,
    status: String
  }],
  aiScans: [{
    scanId: String,
    timestamp: Date,
    riskLevel: String
  }],
  createdAt: Date,
  lastActive: Date
}
```

#### 2. Reports (`reports`)
```javascript
{
  reportId: String (unique),
  reporterId: String (optional),
  isAnonymous: Boolean,
  category: String (enum),
  description: String,
  incidentDate: Date,
  location: String,
  platform: String,
  status: String (enum),
  priority: String (enum),
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Threats (`threats`)
```javascript
{
  threatId: String (unique),
  type: String (enum),
  title: String,
  description: String,
  risk: String (enum),
  location: String,
  aiAnalysis: String,
  status: String (enum),
  viewedBy: [{
    userId: String,
    viewedAt: Date
  }],
  firstReported: Date,
  lastUpdated: Date
}
```

#### 4. Safety Videos (`safetyvideos`)
```javascript
{
  videoId: String (unique),
  title: String,
  scenario: String,
  script: String,
  duration: Number,
  category: String,
  views: Number,
  createdAt: Date
}
```

## 🔗 API Endpoints

### User Management
- `GET /api/users/:userId` - Get user profile
- `POST /api/users/:userId` - Create/update user profile
- `PATCH /api/users/:userId/safety-score` - Update safety score
- `GET /api/users/:userId/quests` - Get completed quests
- `POST /api/users/:userId/quests` - Add completed quest

### Reports
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get all reports (admin)
- `GET /api/reports/pending` - Get pending reports
- `GET /api/reports/category/:category` - Get reports by category
- `PATCH /api/reports/:reportId/status` - Update report status
- `POST /api/reports/:reportId/notes` - Add follow-up notes

### Threats
- `GET /api/threats` - Get active threats
- `GET /api/threats/:id` - Get specific threat
- `POST /api/threats/:id/view` - Mark threat as read
- `POST /api/threats/:id/report` - Report threat occurrence
- `GET /api/threats/risk/:level` - Get threats by risk level
- `GET /api/threats/stats/overview` - Get threat statistics

### Videos
- `GET /api/videos` - Get videos with filtering
- `GET /api/videos/personalized/:userId` - Get personalized videos
- `GET /api/videos/popular` - Get popular videos
- `POST /api/videos/:id/view` - Record video view
- `POST /api/videos/:id/like` - Like video
- `GET /api/videos/stats/overview` - Get video statistics

### Health Check
- `GET /health` - Server health status

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input validation**: Mongoose schema validation
- **Anonymous reporting**: Privacy protection
- **Rate limiting**: (Can be added with express-rate-limit)

## 📈 Analytics & Metrics

The backend supports:
- User engagement tracking
- Safety score analytics
- Threat reporting statistics
- Content performance metrics
- Geographic distribution analysis

## 🚀 Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/consent-quest
PORT=5000
JWT_SECRET=your_secure_jwt_secret
```

### Docker Support:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow the existing schema patterns
2. Add proper validation
3. Include error handling
4. Update API documentation
5. Test thoroughly

## 📄 License

MIT License - see LICENSE file for details.