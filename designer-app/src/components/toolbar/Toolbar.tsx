import { useDesignerStore } from '../../store';
import { Button } from '../ui/button';
import {
  Save,
  Download,
  Upload,
  Settings,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalSpaceBetween,
  AlignVerticalSpaceBetween,
  AlignStartVertical,
  AlignEndVertical,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { exportToRDL, downloadRDL, downloadJSON, loadJSON } from '../../utils/rdl-export';
import exampleTemplate from '../../examples/example-template.json';

export function Toolbar() {
  const {
    reportProperties,
    regions,
    items,
    setShowReportPropertiesDialog,
    undo,
    redo,
    historyIndex,
    history,
    alignItems,
    distributeItems,
    getTemplate,
    loadTemplate,
  } = useDesignerStore();
  
  const selectedItems = items.filter(item => item.selected);
  const canAlign = selectedItems.length >= 2;
  const canDistribute = selectedItems.length >= 3;
  
  const handleExportRDL = () => {
    const rdl = exportToRDL(reportProperties, regions, items);
    downloadRDL(`${reportProperties.title || 'report'}.rdl`, rdl);
  };
  
  const handleSaveTemplate = () => {
    const template = getTemplate();
    downloadJSON(`${reportProperties.title || 'template'}.json`, template);
  };
  
  const handleLoadTemplate = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const template = await loadJSON(file);
          loadTemplate(template);
        } catch (error) {
          alert('Failed to load template: ' + error);
        }
      }
    };
    input.click();
  };
  
  const handleLoadExample = () => {
    loadTemplate(exampleTemplate as any);
  };
  
  return (
    <div className="h-16 bg-card border-b border-border flex items-center px-4 gap-2">
      <TooltipProvider>
        {/* File operations */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleSaveTemplate}>
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Template (JSON)</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleLoadTemplate}>
              <Upload className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Load Template</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleExportRDL}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export RDL</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={handleLoadExample}>
              Load Example
            </Button>
          </TooltipTrigger>
          <TooltipContent>Load Example Template</TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8" />
        
        {/* History */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8" />
        
        {/* Alignment */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => alignItems('left')}
              disabled={!canAlign}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => alignItems('center')}
              disabled={!canAlign}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Center</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => alignItems('right')}
              disabled={!canAlign}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => alignItems('top')}
              disabled={!canAlign}
            >
              <AlignStartVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Top</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => alignItems('middle')}
              disabled={!canAlign}
            >
              <AlignVerticalJustifyCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Middle</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => alignItems('bottom')}
              disabled={!canAlign}
            >
              <AlignEndVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Bottom</TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8" />
        
        {/* Distribution */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => distributeItems('horizontal')}
              disabled={!canDistribute}
            >
              <AlignHorizontalSpaceBetween className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Distribute Horizontally</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => distributeItems('vertical')}
              disabled={!canDistribute}
            >
              <AlignVerticalSpaceBetween className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Distribute Vertically</TooltipContent>
        </Tooltip>
        
        <div className="flex-1" />
        
        {/* Report properties */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowReportPropertiesDialog(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Report Properties</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
