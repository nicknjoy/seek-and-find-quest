export interface GameObject {
  id: string;
  name: string;
  x: number; // Position in percentage
  y: number; // Position in percentage
  width: number; // Size in percentage
  height: number; // Size in percentage
  found: boolean;
}

export interface GameLevel {
  id: number;
  name: string;
  background: string;
  objects: GameObject[];
  timeLimit: number; // in seconds
  targetScore: number;
}

export interface GameState {
  currentLevel: number;
  score: number;
  timeLeft: number;
  foundObjects: string[];
  gameStatus: 'menu' | 'playing' | 'paused' | 'completed' | 'game-over';
  totalLevels: number;
}

export interface GameStats {
  level: number;
  score: number;
  timeBonus: number;
  totalTime: number;
  objectsFound: number;
  totalObjects: number;
}