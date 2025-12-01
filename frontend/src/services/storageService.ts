import { MOCK_THREATS } from '../constants';

export interface UserProfile {
  ageRange: string;
  interests: string[];
  country: string;
  safetyScore: number;
  lastActive: Date;
}

export interface Threat {
  id: string;
  type: string;
  title: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  timestamp: Date;
  location: string;
  aiAnalysis: string;
  isRead: boolean;
}

export interface Report {
  id: string;
  category: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
  anonymous: boolean;
}

export interface SafetyVideo {
  id: string;
  title: string;
  script: string;
  duration: number;
  generatedAt: Date;
}

class StorageService {
  private readonly USER_PROFILE_KEY = 'consent_quest_user_profile';
  private readonly THREATS_KEY = 'consent_quest_threats';
  private readonly REPORTS_KEY = 'consent_quest_reports';
  private readonly VIDEOS_KEY = 'consent_quest_videos';
  private readonly SAFETY_SCORE_KEY = 'consent_quest_safety_score';

  // User Profile
  getUserProfile(): UserProfile | null {
    const stored = localStorage.getItem(this.USER_PROFILE_KEY);
    if (stored) {
      const profile = JSON.parse(stored);
      profile.lastActive = new Date(profile.lastActive);
      return profile;
    }
    return null;
  }

  saveUserProfile(profile: Omit<UserProfile, 'lastActive'>): void {
    const fullProfile: UserProfile = {
      ...profile,
      lastActive: new Date()
    };
    localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(fullProfile));
  }

  updateSafetyScore(score: number): void {
    localStorage.setItem(this.SAFETY_SCORE_KEY, score.toString());
  }

  getSafetyScore(): number {
    const stored = localStorage.getItem(this.SAFETY_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 50; // Default score
  }

  // Threats
  getThreats(): Threat[] {
    const stored = localStorage.getItem(this.THREATS_KEY);
    if (stored) {
      const threats = JSON.parse(stored);
      return threats.map((t: Omit<Threat, 'timestamp'> & { timestamp: string }) => ({
        ...t,
        timestamp: new Date(t.timestamp)
      }));
    }
    // Return mock threats if none stored
    return MOCK_THREATS.map(t => ({ ...t, isRead: false }));
  }

  addThreat(threat: Omit<Threat, 'id' | 'isRead'>): void {
    const threats = this.getThreats();
    const newThreat: Threat = {
      ...threat,
      id: Date.now().toString(),
      isRead: false
    };
    threats.unshift(newThreat); // Add to beginning
    localStorage.setItem(this.THREATS_KEY, JSON.stringify(threats));
  }

  markThreatAsRead(threatId: string): void {
    const threats = this.getThreats();
    const updated = threats.map(t =>
      t.id === threatId ? { ...t, isRead: true } : t
    );
    localStorage.setItem(this.THREATS_KEY, JSON.stringify(updated));
  }

  // Reports
  getReports(): Report[] {
    const stored = localStorage.getItem(this.REPORTS_KEY);
    if (stored) {
      const reports = JSON.parse(stored);
      return reports.map((r: Omit<Report, 'timestamp'> & { timestamp: string }) => ({
        ...r,
        timestamp: new Date(r.timestamp)
      }));
    }
    return [];
  }

  addReport(report: Omit<Report, 'id' | 'status' | 'timestamp'>): void {
    const reports = this.getReports();
    const newReport: Report = {
      ...report,
      id: Date.now().toString(),
      status: 'pending',
      timestamp: new Date()
    };
    reports.push(newReport);
    localStorage.setItem(this.REPORTS_KEY, JSON.stringify(reports));
  }

  // Videos
  getVideos(): SafetyVideo[] {
    const stored = localStorage.getItem(this.VIDEOS_KEY);
    if (stored) {
      const videos = JSON.parse(stored);
      return videos.map((v: Omit<SafetyVideo, 'generatedAt'> & { generatedAt: string }) => ({
        ...v,
        generatedAt: new Date(v.generatedAt)
      }));
    }
    return [];
  }

  addVideo(video: Omit<SafetyVideo, 'id' | 'generatedAt'>): SafetyVideo {
    const videos = this.getVideos();
    const newVideo: SafetyVideo = {
      ...video,
      id: Date.now().toString(),
      generatedAt: new Date()
    };
    videos.push(newVideo);
    localStorage.setItem(this.VIDEOS_KEY, JSON.stringify(videos));
    return newVideo;
  }

  // Clear all data (for testing/offline reset)
  clearAllData(): void {
    localStorage.removeItem(this.USER_PROFILE_KEY);
    localStorage.removeItem(this.THREATS_KEY);
    localStorage.removeItem(this.REPORTS_KEY);
    localStorage.removeItem(this.VIDEOS_KEY);
    localStorage.removeItem(this.SAFETY_SCORE_KEY);
  }
}

export const storageService = new StorageService();