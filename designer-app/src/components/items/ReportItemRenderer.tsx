import type { ReportItem, PluginConfig } from '../../types';
import { TextBoxItem } from './TextBoxItem';
import { SingleFieldItem } from './SingleFieldItem';
import { TableItem } from './TableItem';
import { ImageItem } from './ImageItem';
import { MatrixItem } from './MatrixItem';
import { QRCodeItem } from './QRCodeItem';

interface ReportItemRendererProps {
  item: ReportItem;
  plugin: PluginConfig;
  selected: boolean;
  onSelect: () => void;
  onDrag: (dx: number, dy: number) => void;
  onResize: (width: number, height: number) => void;
}

export function ReportItemRenderer({
  item,
  plugin,
  selected,
  onSelect,
  onDrag,
  onResize,
}: ReportItemRendererProps) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: item.x,
    top: item.y,
    cursor: 'move',
    border: selected ? '2px solid #2563eb' : '1px dashed #ccc',
    boxSizing: 'border-box',
  };

  const renderItem = () => {
    switch (plugin.id) {
      case 'textbox':
        return <TextBoxItem properties={item.properties} />;
      case 'singlefield':
        return <SingleFieldItem properties={item.properties} />;
      case 'table':
        return <TableItem properties={item.properties} />;
      case 'image':
        return <ImageItem properties={item.properties} />;
      case 'matrix':
        return <MatrixItem properties={item.properties} />;
      case 'qrcode':
        return <QRCodeItem properties={item.properties} />;
      default:
        return <div>Unknown item type</div>;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('item-content')) {
      e.stopPropagation();
      onSelect();
      
      const startX = e.clientX;
      const startY = e.clientY;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        onDrag(dx, dy);
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  return (
    <div
      style={style}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="item-content">
        {renderItem()}
      </div>
      
      {selected && (
        <>
          {/* Resize handles */}
          <div
            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              const startX = e.clientX;
              const startY = e.clientY;
              const startWidth = item.properties.width || 100;
              const startHeight = item.properties.height || 30;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;
                onResize(Math.max(10, startWidth + dx), Math.max(10, startHeight + dy));
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        </>
      )}
    </div>
  );
}
