import { useEffect } from 'react';
import { useDesignerStore } from './store';
import { Toolbox } from './components/toolbox/Toolbox';
import { Canvas } from './components/canvas/Canvas';
import { PropertiesPanel } from './components/properties/PropertiesPanel';
import { Toolbar } from './components/toolbar/Toolbar';
import { ReportPropertiesDialog } from './components/dialogs/ReportPropertiesDialog';
import { TooltipProvider } from './components/ui/tooltip';

function App() {
  const {
    deleteSelectedItems,
    undo,
    redo,
    items,
  } = useDesignerStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected items
      if (e.key === 'Delete') {
        deleteSelectedItems();
      }
      
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      
      // Arrow keys for nudging
      const selectedItems = items.filter(item => item.selected);
      if (selectedItems.length > 0 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const nudgeAmount = e.shiftKey ? 10 : 1;
        
        selectedItems.forEach(item => {
          const { updateItem } = useDesignerStore.getState();
          let newX = item.x;
          let newY = item.y;
          
          if (e.key === 'ArrowLeft') newX -= nudgeAmount;
          if (e.key === 'ArrowRight') newX += nudgeAmount;
          if (e.key === 'ArrowUp') newY -= nudgeAmount;
          if (e.key === 'ArrowDown') newY += nudgeAmount;
          
          updateItem(item.id, { x: newX, y: newY });
        });
      }
      
      // Multi-select with Shift+Click is handled in ReportItemRenderer
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, deleteSelectedItems, undo, redo]);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <Toolbox />
          <Canvas />
          <PropertiesPanel />
        </div>
        <ReportPropertiesDialog />
      </div>
    </TooltipProvider>
  );
}

export default App;
