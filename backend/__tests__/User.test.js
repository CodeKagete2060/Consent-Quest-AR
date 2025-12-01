const UserProfile = require('../schemas/User');

describe('UserProfile Schema', () => {
  describe('Schema Methods', () => {
    let mockUser;

    beforeEach(() => {
      mockUser = {
        safetyScore: 50,
        save: jest.fn().mockResolvedValue({ safetyScore: 75 }),
      };
    });

    it('should update safety score correctly', async () => {
      const updateSafetyScore = UserProfile.schema.methods.updateSafetyScore.bind(mockUser);

      const result = await updateSafetyScore(75);

      expect(mockUser.safetyScore).toBe(75);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should clamp safety score to minimum 0', async () => {
      const updateSafetyScore = UserProfile.schema.methods.updateSafetyScore.bind(mockUser);

      await updateSafetyScore(-10);

      expect(mockUser.safetyScore).toBe(0);
    });

    it('should clamp safety score to maximum 100', async () => {
      const updateSafetyScore = UserProfile.schema.methods.updateSafetyScore.bind(mockUser);

      await updateSafetyScore(150);

      expect(mockUser.safetyScore).toBe(100);
    });
  });

  describe('Schema Statics', () => {
    it('should have getUsersByCountry static method', () => {
      expect(typeof UserProfile.getUsersByCountry).toBe('function');
    });
  });

  // Virtuals are hard to test without proper mongoose setup
});