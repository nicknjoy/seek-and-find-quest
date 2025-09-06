import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';
import { Clock, Star, Home, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  gameState: GameState;
  onPause: () => void;
  onHome: () => void;
  className?: string;
}

export const GameHeader = ({ gameState, onPause, onHome, className }: GameHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (gameState.timeLeft <= 30) return 'text-destructive';
    if (gameState.timeLeft <= 60) return 'text-game-timer';
    return 'text-foreground';
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-game-panel border-b border-border",
      className
    )}>
      {/* Left side - Level and Score */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Level</div>
          <div className="text-lg font-bold text-primary">{gameState.currentLevel}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Score</div>
          <div className="text-lg font-bold text-foreground flex items-center gap-1">
            <Star className="w-4 h-4 text-secondary" />
            {gameState.score.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Center - Timer */}
      <div className="text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">Time Left</div>
        <div className={cn("text-xl font-bold flex items-center gap-1", getTimerColor())}>
          <Clock className="w-5 h-5" />
          {formatTime(gameState.timeLeft)}
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPause}
          className="flex items-center gap-2"
        >
          {gameState.gameStatus === 'paused' ? (
            <>
              <Play className="w-4 h-4" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onHome}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Menu
        </Button>
      </div>
    </div>
  );
};