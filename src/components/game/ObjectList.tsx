import { GameObject } from '@/types/game';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ObjectListProps {
  objects: GameObject[];
  foundObjects: string[];
  className?: string;
}

export const ObjectList = ({ objects, foundObjects, className }: ObjectListProps) => {
  return (
    <div className={cn("bg-game-panel rounded-lg p-4 border border-border shadow-lg", className)}>
      <h3 className="text-lg font-bold text-foreground mb-3 text-center">
        Find These Objects
      </h3>
      <div className="space-y-2">
        {objects.map((obj) => {
          const isFound = foundObjects.includes(obj.id);
          
          return (
            <div
              key={obj.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-all duration-300",
                isFound
                  ? "bg-success/20 border border-success text-success-foreground"
                  : "bg-muted/50 border border-border text-foreground"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  isFound
                    ? "bg-success border-success"
                    : "border-muted-foreground"
                )}
              >
                {isFound && <Check className="w-3 h-3 text-success-foreground" />}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-all duration-300",
                  isFound && "line-through opacity-75"
                )}
              >
                {obj.name}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Found: {foundObjects.length} / {objects.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-gradient-success h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(foundObjects.length / objects.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};