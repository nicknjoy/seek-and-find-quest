import { GameLevel } from '@/types/game';
import gameScene1 from '@/assets/game-scene-1.jpg';

export const gameLevels: GameLevel[] = [
  {
    id: 1,
    name: "Cozy Living Room",
    background: gameScene1,
    timeLimit: 180, // 3 minutes
    targetScore: 1000,
    objects: [
      {
        id: "keys",
        name: "Keys",
        x: 15,
        y: 45,
        width: 3,
        height: 4,
        found: false,
      },
      {
        id: "glasses",
        name: "Glasses",
        x: 68,
        y: 32,
        width: 4,
        height: 3,
        found: false,
      },
      {
        id: "book",
        name: "Red Book",
        x: 82,
        y: 25,
        width: 2,
        height: 8,
        found: false,
      },
      {
        id: "clock",
        name: "Clock",
        x: 45,
        y: 15,
        width: 6,
        height: 6,
        found: false,
      },
      {
        id: "toy-car",
        name: "Toy Car",
        x: 25,
        y: 75,
        width: 4,
        height: 3,
        found: false,
      },
      {
        id: "coffee-cup",
        name: "Coffee Cup",
        x: 55,
        y: 55,
        width: 3,
        height: 4,
        found: false,
      },
      {
        id: "remote",
        name: "Remote Control",
        x: 38,
        y: 48,
        width: 2,
        height: 5,
        found: false,
      },
      {
        id: "pen",
        name: "Pen",
        x: 72,
        y: 68,
        width: 1,
        height: 4,
        found: false,
      },
    ],
  },
  // Add more levels here as needed
];

// Function to generate more levels programmatically
export const generateLevel = (levelNumber: number): GameLevel => {
  return {
    id: levelNumber,
    name: `Level ${levelNumber}`,
    background: gameScene1, // Will use same scene for now, can be randomized later
    timeLimit: Math.max(120, 180 - (levelNumber * 2)), // Decrease time as levels progress
    targetScore: 1000 + (levelNumber - 1) * 100,
    objects: [
      // Generate random objects for higher levels
      ...Array.from({ length: Math.min(8 + Math.floor(levelNumber / 5), 15) }, (_, i) => ({
        id: `object-${levelNumber}-${i}`,
        name: `Hidden Item ${i + 1}`,
        x: Math.random() * 85 + 5, // 5% to 90% to keep objects visible
        y: Math.random() * 70 + 15, // 15% to 85% to avoid UI overlap
        width: Math.random() * 3 + 2, // 2% to 5% width
        height: Math.random() * 3 + 2, // 2% to 5% height
        found: false,
      })),
    ],
  };
};

export const getLevel = (levelNumber: number): GameLevel => {
  if (levelNumber <= gameLevels.length) {
    return gameLevels[levelNumber - 1];
  }
  return generateLevel(levelNumber);
};