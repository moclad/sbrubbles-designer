import { useState } from 'react';
import { useDesignerStore } from '../../store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function ReportPropertiesDialog() {
  const {
    reportProperties,
    setReportProperties,
    showReportPropertiesDialog,
    setShowReportPropertiesDialog,
  } = useDesignerStore();
  
  const [localProps, setLocalProps] = useState(reportProperties);
  
  const handleSave = () => {
    setReportProperties(localProps);
    setShowReportPropertiesDialog(false);
  };
  
  const handleCancel = () => {
    setLocalProps(reportProperties);
    setShowReportPropertiesDialog(false);
  };
  
  return (
    <Dialog open={showReportPropertiesDialog} onOpenChange={setShowReportPropertiesDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report Properties</DialogTitle>
          <DialogDescription>
            Configure report-level settings including page size, margins, and metadata.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={localProps.title}
              onChange={(e) => setLocalProps({ ...localProps, title: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={localProps.author}
              onChange={(e) => setLocalProps({ ...localProps, author: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paperSize">Paper Size</Label>
            <Select
              value={localProps.paperSize}
              onValueChange={(value: any) => setLocalProps({ ...localProps, paperSize: value })}
            >
              <SelectTrigger id="paperSize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="orientation">Orientation</Label>
            <Select
              value={localProps.orientation}
              onValueChange={(value: any) => setLocalProps({ ...localProps, orientation: value })}
            >
              <SelectTrigger id="orientation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marginTop">Top Margin (pt)</Label>
              <Input
                id="marginTop"
                type="number"
                value={localProps.margins.top}
                onChange={(e) =>
                  setLocalProps({
                    ...localProps,
                    margins: { ...localProps.margins, top: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marginRight">Right Margin (pt)</Label>
              <Input
                id="marginRight"
                type="number"
                value={localProps.margins.right}
                onChange={(e) =>
                  setLocalProps({
                    ...localProps,
                    margins: { ...localProps.margins, right: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marginBottom">Bottom Margin (pt)</Label>
              <Input
                id="marginBottom"
                type="number"
                value={localProps.margins.bottom}
                onChange={(e) =>
                  setLocalProps({
                    ...localProps,
                    margins: { ...localProps.margins, bottom: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marginLeft">Left Margin (pt)</Label>
              <Input
                id="marginLeft"
                type="number"
                value={localProps.margins.left}
                onChange={(e) =>
                  setLocalProps({
                    ...localProps,
                    margins: { ...localProps.margins, left: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
