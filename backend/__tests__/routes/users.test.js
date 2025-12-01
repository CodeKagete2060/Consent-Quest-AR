const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const UserProfile = require('../../schemas/User');

// Mock mongoose and database
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    on: jest.fn(),
    close: jest.fn(),
  },
}));

// Mock UserProfile methods
const UserProfile = require('../../schemas/User');
jest.spyOn(UserProfile, 'findOne').mockImplementation();
jest.spyOn(UserProfile, 'findOneAndUpdate').mockImplementation();
jest.spyOn(UserProfile, 'getUsersByCountry').mockImplementation();

describe('Users Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/users/:userId', () => {
    it('should return user profile', async () => {
      const mockUser = { userId: '123', ageRange: '18-24' };
      UserProfile.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/123')
        .expect(200);

      expect(response.body).toEqual(mockUser);
      expect(UserProfile.findOne).toHaveBeenCalledWith({ userId: '123' });
    });

    it('should return 404 if user not found', async () => {
      UserProfile.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/users/123')
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('POST /api/users/:userId', () => {
    it('should create or update user profile', async () => {
      const userData = {
        ageRange: '18-24',
        interests: ['WhatsApp'],
        country: 'Kenya',
        safetyScore: 75
      };
      const mockUser = { ...userData, userId: '123' };
      UserProfile.findOneAndUpdate.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/123')
        .send(userData)
        .expect(200);

      expect(response.body).toEqual(mockUser);
    });
  });

  describe('PATCH /api/users/:userId/safety-score', () => {
    it('should update safety score', async () => {
      const mockUser = {
        userId: '123',
        safetyScore: 50,
        updateSafetyScore: jest.fn().mockResolvedValue({ safetyScore: 75 })
      };
      UserProfile.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .patch('/api/users/123/safety-score')
        .send({ safetyScore: 75 })
        .expect(200);

      expect(mockUser.updateSafetyScore).toHaveBeenCalledWith(75);
    });

    it('should return 404 if user not found', async () => {
      UserProfile.findOne.mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/users/123/safety-score')
        .send({ safetyScore: 75 })
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('GET /api/users/:userId/quests', () => {
    it('should return user quests', async () => {
      const mockUser = {
        userId: '123',
        completedQuests: [{ questId: 'q1', score: 100 }]
      };
      UserProfile.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/123/quests')
        .expect(200);

      expect(response.body).toEqual(mockUser.completedQuests);
    });
  });

  describe('POST /api/users/:userId/quests', () => {
    it('should add completed quest', async () => {
      const mockUser = {
        userId: '123',
        completedQuests: [],
        save: jest.fn().mockResolvedValue({})
      };
      UserProfile.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/123/quests')
        .send({ questId: 'q1', score: 100 })
        .expect(200);

      expect(mockUser.completedQuests).toContainEqual({
        questId: 'q1',
        score: 100,
        completedAt: expect.any(Date)
      });
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return 400 if quest already completed', async () => {
      const mockUser = {
        userId: '123',
        completedQuests: [{ questId: 'q1' }]
      };
      UserProfile.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/123/quests')
        .send({ questId: 'q1', score: 100 })
        .expect(400);

      expect(response.body.message).toBe('Quest already completed');
    });
  });

  describe('GET /api/users/country/:country', () => {
    it('should return users by country', async () => {
      const mockUsers = [{ userId: '123', country: 'Kenya' }];
      UserProfile.getUsersByCountry.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users/country/Kenya')
        .expect(200);

      expect(response.body).toEqual(mockUsers);
      expect(UserProfile.getUsersByCountry).toHaveBeenCalledWith('Kenya');
    });
  });
});