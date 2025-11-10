import { useRef } from 'react';
import { useDesignerStore } from '../../store';
import { ReportItemRenderer } from '../items/ReportItemRenderer';
import { PAPER_SIZES } from '../../types';

export function Canvas() {
  const {
    reportProperties,
    regions,
    items,
    plugins,
    addItem,
    updateItem,
    selectItem,
    clearSelection,
    updateRegionHeight,
  } = useDesignerStore();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const paperSize = PAPER_SIZES[reportProperties.paperSize][reportProperties.orientation];
  const scale = 0.75; // Scale for display
  const canvasWidth = paperSize.width * scale;
  const canvasHeight = paperSize.height * scale;
  
  const handleDrop = (e: React.DragEvent, regionName: 'header' | 'body' | 'footer') => {
    e.preventDefault();
    const pluginId = e.dataTransfer.getData('pluginId');
    const plugin = plugins.find(p => p.id === pluginId);
    
    if (!plugin) return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const regionElement = e.currentTarget;
    const regionRect = regionElement.getBoundingClientRect();
    
    const x = (e.clientX - regionRect.left) / scale;
    const y = (e.clientY - regionRect.top) / scale;
    
    const newItem = {
      id: `${plugin.id}-${Date.now()}`,
      pluginId: plugin.id,
      x,
      y,
      region: regionName,
      properties: { ...plugin.defaultProperties },
      selected: false,
    };
    
    addItem(newItem);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleItemDrag = (itemId: string, dx: number, dy: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    updateItem(itemId, {
      x: item.x + dx / scale,
      y: item.y + dy / scale,
    });
  };
  
  const handleItemResize = (itemId: string, width: number, height: number) => {
    updateItem(itemId, {
      properties: {
        ...items.find(i => i.id === itemId)?.properties,
        width,
        height,
      },
    });
  };
  
  const handleResizeRegion = (regionName: 'header' | 'body' | 'footer', startY: number) => {
    const region = regions.find(r => r.name === regionName);
    if (!region) return;
    
    const initialHeight = region.height;
    
    const handleMouseMove = (e: MouseEvent) => {
      const dy = (e.clientY - startY) / scale;
      updateRegionHeight(regionName, initialHeight + dy);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const renderRegion = (regionName: 'header' | 'body' | 'footer') => {
    const region = regions.find(r => r.name === regionName);
    if (!region) return null;
    
    const regionItems = items.filter(item => item.region === regionName);
    
    return (
      <div
        key={regionName}
        className="relative border-b border-border"
        style={{ height: region.height * scale }}
        onDrop={(e) => handleDrop(e, regionName)}
        onDragOver={handleDragOver}
      >
        <div className="absolute top-2 left-2 text-xs text-muted-foreground uppercase font-semibold z-10">
          {regionName}
        </div>
        
        {regionItems.map((item) => {
          const plugin = plugins.find(p => p.id === item.pluginId);
          if (!plugin) return null;
          
          return (
            <div
              key={item.id}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <ReportItemRenderer
                item={item}
                plugin={plugin}
                selected={item.selected || false}
                onSelect={() => selectItem(item.id)}
                onDrag={(dx, dy) => handleItemDrag(item.id, dx, dy)}
                onResize={(width, height) => handleItemResize(item.id, width, height)}
              />
            </div>
          );
        })}
        
        {/* Resize handle */}
        {regionName !== 'body' && (
          <div
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-blue-500/20 hover:bg-blue-500/40 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              handleResizeRegion(regionName, e.clientY);
            }}
          />
        )}
      </div>
    );
  };
  
  return (
    <div className="flex-1 overflow-auto bg-muted p-8">
      <div className="flex justify-center">
        <div
          ref={canvasRef}
          className="bg-white shadow-lg"
          style={{
            width: canvasWidth,
            height: canvasHeight,
          }}
          onClick={clearSelection}
        >
          {renderRegion('header')}
          {renderRegion('body')}
          {renderRegion('footer')}
        </div>
      </div>
    </div>
  );
}
