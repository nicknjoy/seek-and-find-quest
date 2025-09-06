import { useState, useEffect, useCallback } from 'react';
import { GameState, GameStats } from '@/types/game';
import { getLevel } from '@/data/levels';
import { GameMenu } from './GameMenu';
import { GameBoard } from './GameBoard';
import { GameHeader } from './GameHeader';
import { ObjectList } from './ObjectList';
import { GameComplete } from './GameComplete';
import { toast } from '@/hooks/use-toast';

export const HiddenObjectGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    timeLeft: 180,
    foundObjects: [],
    gameStatus: 'menu',
    totalLevels: 50,
  });

  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const currentLevel = getLevel(gameState.currentLevel);

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus !== 'playing' || gameState.timeLeft <= 0) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          // Time's up - calculate stats and show game over
          const stats: GameStats = {
            level: prev.currentLevel,
            score: prev.score,
            timeBonus: 0,
            totalTime: currentLevel.timeLimit,
            objectsFound: prev.foundObjects.length,
            totalObjects: currentLevel.objects.length,
          };
          setGameStats(stats);
          return { ...prev, timeLeft: 0, gameStatus: 'game-over' };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus, gameState.timeLeft, currentLevel.timeLimit, currentLevel.objects.length]);

  // Check if level is complete
  useEffect(() => {
    if (gameState.foundObjects.length === currentLevel.objects.length && gameState.gameStatus === 'playing') {
      const timeBonus = Math.floor(gameState.timeLeft * 5); // 5 points per second remaining
      const finalScore = gameState.score + timeBonus;
      
      const stats: GameStats = {
        level: gameState.currentLevel,
        score: finalScore,
        timeBonus,
        totalTime: currentLevel.timeLimit - gameState.timeLeft,
        objectsFound: gameState.foundObjects.length,
        totalObjects: currentLevel.objects.length,
      };
      
      setGameStats(stats);
      setGameState(prev => ({ 
        ...prev, 
        score: finalScore,
        gameStatus: 'completed' 
      }));
      
      toast({
        title: "Level Complete!",
        description: `You found all objects! +${timeBonus} time bonus`,
      });
    }
  }, [gameState.foundObjects.length, currentLevel.objects.length, gameState.timeLeft, gameState.score, gameState.currentLevel, currentLevel.timeLimit, gameState.gameStatus]);

  const startGame = useCallback((level?: number) => {
    const targetLevel = level || gameState.currentLevel;
    const levelData = getLevel(targetLevel);
    
    setGameState({
      currentLevel: targetLevel,
      score: level ? 0 : gameState.score, // Reset score only if starting from specific level
      timeLeft: levelData.timeLimit,
      foundObjects: [],
      gameStatus: 'playing',
      totalLevels: 50,
    });
    setGameStats(null);
  }, [gameState.currentLevel, gameState.score]);

  const handleObjectFound = useCallback((objectId: string, points: number) => {
    setGameState(prev => {
      if (prev.foundObjects.includes(objectId)) return prev;
      
      const newFoundObjects = [...prev.foundObjects, objectId];
      const newScore = prev.score + points;
      
      toast({
        title: "Object Found!",
        description: `+${points} points`,
      });
      
      return {
        ...prev,
        foundObjects: newFoundObjects,
        score: newScore,
      };
    });
  }, []);

  const handlePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'paused' ? 'playing' : 'paused',
    }));
  }, []);

  const handleHome = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'menu',
    }));
    setGameStats(null);
  }, []);

  const handleNextLevel = useCallback(() => {
    const nextLevel = gameState.currentLevel + 1;
    startGame(nextLevel);
  }, [gameState.currentLevel, startGame]);

  const handleRetry = useCallback(() => {
    startGame(gameState.currentLevel);
  }, [gameState.currentLevel, startGame]);

  // Render based on game status
  if (gameState.gameStatus === 'menu') {
    return (
      <GameMenu
        onStartGame={() => startGame()}
        onSelectLevel={startGame}
        currentLevel={gameState.currentLevel}
        totalScore={gameState.score}
      />
    );
  }

  if (gameState.gameStatus === 'completed' || gameState.gameStatus === 'game-over') {
    return (
      <div className="min-h-screen bg-gradient-game relative">
        {/* Game background (blurred) */}
        <div className="absolute inset-0 opacity-30">
          <div className="flex h-full">
            <div className="flex-1">
              <GameBoard
                level={currentLevel}
                onObjectFound={() => {}}
                foundObjects={gameState.foundObjects}
                className="h-full"
              />
            </div>
          </div>
        </div>
        
        <GameComplete
          stats={gameStats!}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
          onHome={handleHome}
          isLastLevel={gameState.currentLevel >= gameState.totalLevels}
        />
      </div>
    );
  }

  // Playing or paused state
  return (
    <div className="min-h-screen bg-gradient-game flex flex-col">
      <GameHeader
        gameState={gameState}
        onPause={handlePause}
        onHome={handleHome}
      />
      
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Game Board */}
        <div className="flex-1 min-h-0">
          <GameBoard
            level={currentLevel}
            onObjectFound={handleObjectFound}
            foundObjects={gameState.foundObjects}
            className="h-full"
          />
        </div>
        
        {/* Object List Sidebar */}
        <div className="w-80 flex-shrink-0">
          <ObjectList
            objects={currentLevel.objects}
            foundObjects={gameState.foundObjects}
            className="h-full"
          />
        </div>
      </div>

      {/* Pause Overlay */}
      {gameState.gameStatus === 'paused' && (
        <div className="fixed inset-0 bg-game-bg/80 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card p-8 rounded-lg border border-border shadow-game text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Game Paused</h2>
            <p className="text-muted-foreground">Click Resume to continue playing</p>
          </div>
        </div>
      )}
    </div>
  );
};