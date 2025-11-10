import { useDesignerStore } from '../../store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { SAMPLE_DATA_FIELDS } from '../../types';

export function PropertiesPanel() {
  const { items, plugins, updateItem } = useDesignerStore();
  
  const selectedItems = items.filter(item => item.selected);
  
  if (selectedItems.length === 0) {
    return (
      <div className="w-80 bg-card border-l border-border flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Properties</h2>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center text-muted-foreground">
          <p>No item selected</p>
        </div>
      </div>
    );
  }
  
  if (selectedItems.length > 1) {
    return (
      <div className="w-80 bg-card border-l border-border flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Properties</h2>
        </div>
        <div className="flex-1 p-4">
          <p className="text-sm text-muted-foreground">{selectedItems.length} items selected</p>
          <p className="text-xs text-muted-foreground mt-2">Use toolbar to align or distribute items</p>
        </div>
      </div>
    );
  }
  
  const selectedItem = selectedItems[0];
  const plugin = plugins.find(p => p.id === selectedItem.pluginId);
  
  if (!plugin) return null;
  
  const handlePropertyChange = (propertyName: string, value: any) => {
    updateItem(selectedItem.id, {
      properties: {
        ...selectedItem.properties,
        [propertyName]: value,
      },
    });
  };
  
  const renderPropertyInput = (propName: string, propType: any) => {
    const currentValue = selectedItem.properties[propName];
    
    switch (propType.type) {
      case 'text':
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(propName, e.target.value)}
            placeholder={propType.label}
          />
        );
        
      case 'number':
        return (
          <Input
            type="number"
            value={currentValue || propType.min || 0}
            onChange={(e) => handlePropertyChange(propName, parseFloat(e.target.value) || 0)}
            min={propType.min}
            max={propType.max}
          />
        );
        
      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={currentValue || '#000000'}
              onChange={(e) => handlePropertyChange(propName, e.target.value)}
              className="w-16 h-10"
            />
            <Input
              value={currentValue || '#000000'}
              onChange={(e) => handlePropertyChange(propName, e.target.value)}
              placeholder="#000000"
            />
          </div>
        );
        
      case 'select':
        return (
          <Select
            value={currentValue || propType.options[0]}
            onValueChange={(value) => handlePropertyChange(propName, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {propType.options.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'boolean':
        return (
          <Select
            value={currentValue ? 'true' : 'false'}
            onValueChange={(value) => handlePropertyChange(propName, value === 'true')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );
        
      case 'dataField':
        return (
          <Select
            value={currentValue || ''}
            onValueChange={(value) => handlePropertyChange(propName, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select field..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {SAMPLE_DATA_FIELDS.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Properties</h2>
        <p className="text-sm text-muted-foreground">{plugin.displayName}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-2">
          <Label>Position X</Label>
          <Input
            type="number"
            value={selectedItem.x}
            onChange={(e) => updateItem(selectedItem.id, { x: parseFloat(e.target.value) || 0 })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Position Y</Label>
          <Input
            type="number"
            value={selectedItem.y}
            onChange={(e) => updateItem(selectedItem.id, { y: parseFloat(e.target.value) || 0 })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Region</Label>
          <Select
            value={selectedItem.region}
            onValueChange={(value: any) => updateItem(selectedItem.id, { region: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header">Header</SelectItem>
              <SelectItem value="body">Body</SelectItem>
              <SelectItem value="footer">Footer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        {Object.entries(plugin.propertyTypes).map(([propName, propType]) => (
          <div key={propName} className="space-y-2">
            <Label>{propType.label}</Label>
            {renderPropertyInput(propName, propType)}
          </div>
        ))}
      </div>
    </div>
  );
}
