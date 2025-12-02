import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '../apiService';

// Mock fetch
global.fetch = vi.fn();

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset fetch mock
    global.fetch = vi.fn();
  });


  describe('User API methods', () => {
    it('should get user profile', async () => {
      const mockUser = { userId: '123', safetyScore: 80 };
      (global.fetch as unknown as { mockResolvedValue: (value: unknown) => void }).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      const result = await apiService.getUserProfile('123');

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/users/123',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should update user profile', async () => {
      const profile = { ageRange: '18-25' };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ...profile, userId: '123' })
      });

      const result = await apiService.updateUserProfile('123', profile);

      expect(result).toEqual({ ...profile, userId: '123' });
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/users/123',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(profile)
        })
      );
    });
  });

  describe('Threat API methods', () => {
    it('should get threats', async () => {
      const mockThreats = { threats: [], total: 0 };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockThreats)
      });

      const result = await apiService.getThreats();

      expect(result).toEqual(mockThreats);
    });

    it('should mark threat as read', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Marked as read' })
      });

      const result = await apiService.markThreatAsRead('t1', 'u1');

      expect(result).toEqual({ message: 'Marked as read' });
    });
  });

  describe('Report API methods', () => {
    it('should submit report', async () => {
      const report = { category: 'harassment', description: 'Test report' };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'r1' })
      });

      const result = await apiService.submitReport(report);

      expect(result).toEqual({ id: 'r1' });
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/reports',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(report)
        })
      );
    });
  });
});