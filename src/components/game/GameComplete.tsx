import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GameStats } from '@/types/game';
import { Star, Clock, Trophy, ArrowRight, Home } from 'lucide-react';

interface GameCompleteProps {
  stats: GameStats;
  onNextLevel: () => void;
  onRetry: () => void;
  onHome: () => void;
  isLastLevel?: boolean;
  className?: string;
}

export const GameComplete = ({ 
  stats, 
  onNextLevel, 
  onRetry, 
  onHome, 
  isLastLevel = false,
  className 
}: GameCompleteProps) => {
  const completionPercentage = (stats.objectsFound / stats.totalObjects) * 100;
  const isSuccess = completionPercentage === 100;

  return (
    <div className={cn(
      "fixed inset-0 bg-game-bg/80 backdrop-blur-sm flex items-center justify-center p-4 z-50",
      className
    )}>
      <Card className="w-full max-w-md p-6 bg-card border border-border shadow-game animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-success rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-success-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {isSuccess ? 'Level Complete!' : 'Level Failed'}
          </h2>
          <p className="text-muted-foreground">
            Level {stats.level} - {isSuccess ? 'Great job!' : 'Try again!'}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary flex items-center justify-center gap-1">
                <Star className="w-4 h-4" />
                {stats.score.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Final Score</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-secondary flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.floor(stats.totalTime / 60)}:{(stats.totalTime % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">Time Taken</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Objects Found</span>
              <span className="font-medium">{stats.objectsFound} / {stats.totalObjects}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  isSuccess ? "bg-gradient-success" : "bg-gradient-primary"
                )}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {stats.timeBonus > 0 && (
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-success">+{stats.timeBonus}</div>
                <div className="text-xs text-success/80">Time Bonus!</div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isSuccess && !isLastLevel && (
            <Button
              onClick={onNextLevel}
              className="w-full h-12 text-lg font-semibold bg-gradient-primary shadow-game"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Next Level
            </Button>
          )}

          {isLastLevel && (
            <div className="text-center p-4 bg-gradient-success/20 rounded-lg border border-success/30">
              <h3 className="text-lg font-bold text-success mb-1">Congratulations!</h3>
              <p className="text-sm text-success/80">You've completed all available levels!</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onRetry}
              className="h-10"
            >
              Retry Level
            </Button>
            <Button
              variant="outline"
              onClick={onHome}
              className="h-10"
            >
              <Home className="w-4 h-4 mr-2" />
              Menu
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};