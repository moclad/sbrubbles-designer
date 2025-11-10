import { useDesignerStore } from '../../store';
import * as Icons from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

export function Toolbox() {
  const plugins = useDesignerStore((state) => state.plugins);

  const handleDragStart = (e: React.DragEvent, pluginId: string) => {
    e.dataTransfer.setData('pluginId', pluginId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Toolbox</h2>
        <p className="text-sm text-muted-foreground">Drag items to canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <TooltipProvider>
          <div className="grid grid-cols-2 gap-2">
            {plugins.map((plugin) => {
              const IconComponent = (Icons as any)[plugin.icon] || Icons.Box;
              
              return (
                <Tooltip key={plugin.id}>
                  <TooltipTrigger asChild>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, plugin.id)}
                      className="flex flex-col items-center justify-center p-4 bg-secondary hover:bg-secondary/80 rounded-md cursor-move transition-colors"
                    >
                      <IconComponent className="w-8 h-8 mb-2" />
                      <span className="text-xs text-center">{plugin.displayName}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Drag to add {plugin.displayName}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
