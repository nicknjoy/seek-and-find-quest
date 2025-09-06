import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Play, Star, Trophy, Settings } from 'lucide-react';

interface GameMenuProps {
  onStartGame: () => void;
  onSelectLevel: (level: number) => void;
  currentLevel: number;
  totalScore: number;
  className?: string;
}

export const GameMenu = ({ 
  onStartGame, 
  onSelectLevel, 
  currentLevel, 
  totalScore, 
  className 
}: GameMenuProps) => {
  const unlockedLevels = Math.min(currentLevel + 2, 50); // Can play 2 levels ahead

  return (
    <div className={cn(
      "min-h-screen bg-gradient-game flex flex-col items-center justify-center p-4",
      className
    )}>
      <div className="w-full max-w-md space-y-6">
        {/* Game Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Hidden Objects
          </h1>
          <p className="text-muted-foreground">
            Find all the hidden objects to complete each level!
          </p>
        </div>

        {/* Stats Card */}
        <Card className="p-6 bg-card/90 backdrop-blur-sm border border-border/50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{currentLevel}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary flex items-center justify-center gap-1">
                <Star className="w-5 h-5" />
                {totalScore.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </div>
          </div>
        </Card>

        {/* Main Actions */}
        <div className="space-y-3">
          <Button
            onClick={onStartGame}
            className="w-full h-12 text-lg font-semibold bg-gradient-primary border-0 shadow-game"
          >
            <Play className="w-5 h-5 mr-2" />
            Continue Game
          </Button>

          <Button
            variant="outline"
            onClick={() => onSelectLevel(1)}
            className="w-full h-12 text-lg font-semibold"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Start from Level 1
          </Button>
        </div>

        {/* Level Selection */}
        <Card className="p-4 bg-card/90 backdrop-blur-sm border border-border/50">
          <h3 className="text-lg font-semibold mb-3 text-center">Select Level</h3>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: Math.min(unlockedLevels, 25) }, (_, i) => i + 1).map((level) => (
              <Button
                key={level}
                variant={level === currentLevel ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectLevel(level)}
                className={cn(
                  "aspect-square p-0 text-sm font-medium",
                  level === currentLevel && "bg-gradient-primary"
                )}
              >
                {level}
              </Button>
            ))}
          </div>
          {unlockedLevels > 25 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              +{unlockedLevels - 25} more levels unlocked
            </p>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};