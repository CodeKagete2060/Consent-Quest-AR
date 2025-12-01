// API Service for connecting frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface UserProfileUpdate {
  ageRange?: string;
  interests?: string[];
  country?: string;
  safetyScore?: number;
  totalXP?: number;
  completedQuests?: Array<{ questId: string; score: number; completedAt: Date }>;
  badges?: string[];
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Record<string, unknown>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User Profile APIs
  async getUserProfile(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, profile: UserProfileUpdate) {
    return this.request(`/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async updateSafetyScore(userId: string, score: number) {
    return this.request(`/users/${userId}/safety-score`, {
      method: 'PATCH',
      body: JSON.stringify({ safetyScore: score }),
    });
  }

  async getUserQuests(userId: string) {
    return this.request(`/users/${userId}/quests`);
  }

  async addCompletedQuest(userId: string, questId: string, score: number) {
    return this.request(`/users/${userId}/quests`, {
      method: 'POST',
      body: JSON.stringify({ questId, score }),
    });
  }

  // Threat APIs
  async getThreats(params: { country?: string; risk?: string; limit?: number } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    return this.request(`/threats?${queryParams}`);
  }

  async getThreat(threatId: string) {
    return this.request(`/threats/${threatId}`);
  }

  async markThreatAsRead(threatId: string, userId: string) {
    return this.request(`/threats/${threatId}/view`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async reportThreat(threatId: string, userId: string, anonymous = true) {
    return this.request(`/threats/${threatId}/report`, {
      method: 'POST',
      body: JSON.stringify({ userId, anonymous }),
    });
  }

  async getThreatStats() {
    return this.request('/threats/stats/overview');
  }

  // Report APIs
  async submitReport(report: {
    category: string;
    description: string;
    incidentDate?: Date;
    location?: string;
    platform?: string;
    reporterId?: string;
    isAnonymous?: boolean;
  }) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  async getReports(params: { status?: string; limit?: number } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    return this.request(`/reports?${queryParams}`);
  }

  // Video APIs
  async getVideos(params: {
    category?: string;
    ageRange?: string;
    interests?: string[];
    limit?: number;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    return this.request(`/videos?${queryParams}`);
  }

  async getPersonalizedVideos(userId: string, ageRange: string, interests: string[], limit = 10) {
    const queryParams = new URLSearchParams({
      ageRange,
      interests: interests.join(','),
      limit: limit.toString()
    });
    return this.request(`/videos/personalized/${userId}?${queryParams}`);
  }

  async getPopularVideos(limit = 10) {
    return this.request(`/videos/popular?limit=${limit}`);
  }

  async recordVideoView(videoId: string, userId: string, completed = false) {
    return this.request(`/videos/${videoId}/view`, {
      method: 'POST',
      body: JSON.stringify({ userId, completed }),
    });
  }

  async likeVideo(videoId: string, userId: string) {
    return this.request(`/videos/${videoId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getVideoStats() {
    return this.request('/videos/stats/overview');
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: 'Backend unreachable' };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Helper function to sync localStorage data with backend
export const syncWithBackend = async (userId: string) => {
  try {
    // Get local data
    const localProgress = JSON.parse(localStorage.getItem('consent_quest_progress') || '{}');

    // Sync with backend
    if (localProgress.xp) {
      await apiService.updateUserProfile(userId, {
        totalXP: localProgress.xp,
        completedQuests: localProgress.completedQuests || [],
        badges: localProgress.badges || []
      });
    }

    console.log('✅ Data synced with backend');
  } catch (error) {
    console.error('❌ Backend sync failed:', error);
  }
};