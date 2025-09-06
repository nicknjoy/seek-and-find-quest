import { useState, useCallback, useRef } from 'react';
import { GameObject, GameLevel } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  level: GameLevel;
  onObjectFound: (objectId: string, points: number) => void;
  foundObjects: string[];
  className?: string;
}

export const GameBoard = ({ level, onObjectFound, foundObjects, className }: GameBoardProps) => {
  const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Show click effect
    setClickedPosition({ x, y });
    setTimeout(() => setClickedPosition(null), 500);

    // Check if click hits any unfound object (with tolerance for easier clicking)
    const tolerance = 2; // 2% tolerance on each side
    const hitObject = level.objects.find(obj => {
      if (foundObjects.includes(obj.id)) return false;
      
      return (
        x >= obj.x - tolerance &&
        x <= obj.x + obj.width + tolerance &&
        y >= obj.y - tolerance &&
        y <= obj.y + obj.height + tolerance
      );
    });

    if (hitObject) {
      const points = Math.floor(100 + Math.random() * 100); // Random points between 100-200
      onObjectFound(hitObject.id, points);
    }
  }, [level.objects, foundObjects, onObjectFound]);

  return (
    <div 
      ref={boardRef}
      className={cn(
        "relative w-full h-full bg-cover bg-center bg-no-repeat cursor-crosshair select-none",
        "border-2 border-border rounded-lg overflow-hidden shadow-game",
        className
      )}
      style={{ backgroundImage: `url(${level.background})` }}
      onClick={handleClick}
    >
      {/* Click effect */}
      {clickedPosition && (
        <div
          className="absolute w-8 h-8 bg-primary/30 border-2 border-primary rounded-full animate-found-pulse pointer-events-none"
          style={{
            left: `${clickedPosition.x}%`,
            top: `${clickedPosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Found objects indicators */}
      {level.objects.map((obj) => {
        if (!foundObjects.includes(obj.id)) return null;
        
        return (
          <div
            key={obj.id}
            className="absolute border-2 border-success bg-success/20 rounded animate-bounce-in pointer-events-none shadow-found"
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              width: `${obj.width}%`,
              height: `${obj.height}%`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-success opacity-30 rounded" />
          </div>
        );
      })}

      {/* Game instructions overlay */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
        <p className="text-sm font-medium text-foreground">
          Find the hidden objects by clicking on them!
        </p>
      </div>
    </div>
  );
};