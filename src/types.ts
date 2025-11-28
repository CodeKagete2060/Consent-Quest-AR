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

// MindAR types
declare global {
  interface Window {
    MINDAR: any;
    THREE: any;
  }
}
