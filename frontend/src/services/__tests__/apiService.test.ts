/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from '../apiService';

// Mock fetch
(globalThis as any).fetch = vi.fn();

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('request method', () => {
    it('should make GET request successfully', async () => {
      const mockResponse = { data: 'test' };
      ((globalThis as any).fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService['request']('/test');

      expect((globalThis as any).fetch).toHaveBeenCalledWith('http://localhost:5000/api/test', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should add auth token if available', async () => {
      localStorage.setItem('auth_token', 'test-token');
      const mockResponse = { data: 'test' };
      ((globalThis as any).fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await apiService['request']('/test');

      expect((globalThis as any).fetch).toHaveBeenCalledWith('http://localhost:5000/api/test', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token',
        },
      });
    });

    it('should throw error on failed response', async () => {
      ((globalThis as any).fetch).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' }),
      });

      await expect(apiService['request']('/test')).rejects.toThrow('Not found');
    });
  });

  describe('User API methods', () => {
    beforeEach(() => {
      (globalThis as any).fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    });

    it('should call getUserProfile', async () => {
      await apiService.getUserProfile('123');

      expect((globalThis as any).fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/123', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should call updateUserProfile with POST', async () => {
      const profile = { ageRange: '18-24' };
      await apiService.updateUserProfile('123', profile);

      expect((globalThis as any).fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/123', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
    });

    it('should call updateSafetyScore with PATCH', async () => {
      await apiService.updateSafetyScore('123', 75);

      expect((globalThis as any).fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/123/safety-score', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ safetyScore: 75 }),
      });
    });

    it('should call getUserQuests', async () => {
      await apiService.getUserQuests('123');

      expect((globalThis as any).fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/123/quests', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should call addCompletedQuest with POST', async () => {
      await apiService.addCompletedQuest('123', 'quest1', 100);

      expect((globalThis as any).fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/123/quests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questId: 'quest1', score: 100 }),
      });
    });
  });

  describe('Health check', () => {
    it('should call health endpoint', async () => {
      const mockResponse = { status: 'OK' };
      ((globalThis as any).fetch).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.healthCheck();

      expect((globalThis as any).fetch).toHaveBeenCalledWith('http://localhost:5000/health');
      expect(result).toEqual(mockResponse);
    });

    it('should handle health check error', async () => {
      ((globalThis as any).fetch).mockRejectedValue(new Error('Network error'));

      const result = await apiService.healthCheck();

      expect(result).toEqual({ status: 'error', message: 'Backend unreachable' });
    });
  });
});