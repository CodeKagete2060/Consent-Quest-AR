export interface Choice {
  text: string;
  next: string;
  type?: 'constructive' | 'risky' | 'avoidance' | 'supportive' | 'proactive';
}

export interface LessonCard {
  title: string;
  what: string;
  prevent: string[];
  fix: string[];
}

export interface Scene {
  id: string;
  text: string;
  choices?: Choice[];
  feedback?: string;
  next?: string;
  isLesson?: boolean;
  lessonCard?: LessonCard;
  isEnd?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  track: 'survivor' | 'ally';
  country: string;
  description: string;
  intro_scene: string;
  scenes: Record<string, Scene>;
  xp: number;
  badge: string;
}

// New types for Safety Sentinel features
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

export interface ScamAnalysis {
  risk: 'low' | 'medium' | 'high';
  explanation: string;
  advice: string;
}

export interface SafetyTip {
  tip: string;
  category: string;
}

// MindAR types
declare global {
  interface Window {
    MINDAR: {
      IMAGE: {
        MindARThree: new (config: {
          container: HTMLElement;
          imageTargetSrc: string;
        }) => {
          start: () => Promise<void>;
          addAnchor: (index: number) => { group: { add: (obj: unknown) => void } };
        };
      };
    };
    THREE: {
      CanvasTexture: new (canvas: HTMLCanvasElement) => unknown;
      PlaneGeometry: new (width: number, height: number) => unknown;
      MeshBasicMaterial: new (options: { map: unknown; transparent?: boolean }) => unknown;
      Mesh: new (geometry: unknown, material: unknown) => unknown;
    };
  }
}
