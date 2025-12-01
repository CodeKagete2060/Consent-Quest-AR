import { getProgress, saveProgress, saveLastRoute, getLastRoute, getLevel, markCardGenerated } from '../storage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProgress', () => {
    it('should return default progress when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getProgress();

      expect(result).toEqual({ xp: 0, badges: [], completedQuests: [], generatedCards: [] });
      expect(localStorageMock.getItem).toHaveBeenCalledWith('consent_quest_progress');
    });

    it('should return parsed progress from localStorage', () => {
      const storedProgress = { xp: 100, badges: ['badge1'], completedQuests: ['quest1'], generatedCards: [] };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedProgress));

      const result = getProgress();

      expect(result).toEqual(storedProgress);
    });
  });

  describe('saveProgress', () => {
    it('should save new progress when quest not completed', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ xp: 0, badges: [], completedQuests: [], generatedCards: [] }));

      const result = saveProgress(50, 'badge1', 'quest1');

      expect(result).toEqual({ xp: 50, badges: ['badge1'], completedQuests: ['quest1'], generatedCards: [] });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'consent_quest_progress',
        JSON.stringify({ xp: 50, badges: ['badge1'], completedQuests: ['quest1'], generatedCards: [] })
      );
    });

    it('should return existing progress when quest already completed', () => {
      const existingProgress = { xp: 100, badges: ['badge1'], completedQuests: ['quest1'], generatedCards: [] };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingProgress));

      const result = saveProgress(50, 'badge2', 'quest1');

      expect(result).toEqual(existingProgress);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('saveLastRoute', () => {
    it('should save route to localStorage', () => {
      saveLastRoute('/dashboard');

      expect(localStorageMock.setItem).toHaveBeenCalledWith('consent_quest_last_route', '/dashboard');
    });
  });

  describe('getLastRoute', () => {
    it('should return route from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('/dashboard');

      const result = getLastRoute();

      expect(result).toBe('/dashboard');
    });

    it('should return default route when not set', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getLastRoute();

      expect(result).toBe('/');
    });
  });

  describe('getLevel', () => {
    it('should calculate level correctly', () => {
      expect(getLevel(0)).toBe(1);
      expect(getLevel(99)).toBe(1);
      expect(getLevel(100)).toBe(2);
      expect(getLevel(250)).toBe(3);
    });
  });

  describe('markCardGenerated', () => {
    it('should add badge to generatedCards if not present', () => {
      const existingProgress = { xp: 100, badges: [], completedQuests: [], generatedCards: [] };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingProgress));

      markCardGenerated('badge1');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'consent_quest_progress',
        JSON.stringify({ ...existingProgress, generatedCards: ['badge1'] })
      );
    });

    it('should not add badge if already generated', () => {
      const existingProgress = { xp: 100, badges: [], completedQuests: [], generatedCards: ['badge1'] };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingProgress));

      markCardGenerated('badge1');

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });
});