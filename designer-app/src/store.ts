import { create } from 'zustand';
import type { ReportItem, ReportProperties, CanvasRegion, PluginConfig, TemplateState } from './types';
import pluginConfigData from './plugins/plugin-config.json';

interface HistoryState {
  items: ReportItem[];
  regions: CanvasRegion[];
}

interface DesignerStore {
  // Plugins
  plugins: PluginConfig[];
  
  // Report properties
  reportProperties: ReportProperties;
  setReportProperties: (props: Partial<ReportProperties>) => void;
  
  // Canvas regions
  regions: CanvasRegion[];
  updateRegionHeight: (regionName: 'header' | 'body' | 'footer', height: number) => void;
  
  // Items
  items: ReportItem[];
  addItem: (item: ReportItem) => void;
  updateItem: (id: string, updates: Partial<ReportItem>) => void;
  deleteSelectedItems: () => void;
  selectItem: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  
  // History
  history: HistoryState[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  
  // UI state
  showReportPropertiesDialog: boolean;
  setShowReportPropertiesDialog: (show: boolean) => void;
  
  // Template operations
  loadTemplate: (template: TemplateState) => void;
  getTemplate: () => TemplateState;
  
  // Alignment operations
  alignItems: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeItems: (direction: 'horizontal' | 'vertical') => void;
}

const DEFAULT_REPORT_PROPERTIES: ReportProperties = {
  title: 'New Report',
  author: 'Report Designer',
  paperSize: 'Letter',
  orientation: 'portrait',
  margins: {
    top: 36,
    right: 36,
    bottom: 36,
    left: 36,
  },
};

const DEFAULT_REGIONS: CanvasRegion[] = [
  { name: 'header', height: 100 },
  { name: 'body', height: 500 },
  { name: 'footer', height: 80 },
];

export const useDesignerStore = create<DesignerStore>((set, get) => ({
  plugins: pluginConfigData.plugins as unknown as PluginConfig[],
  
  reportProperties: DEFAULT_REPORT_PROPERTIES,
  setReportProperties: (props) => set((state) => ({
    reportProperties: { ...state.reportProperties, ...props }
  })),
  
  regions: DEFAULT_REGIONS,
  updateRegionHeight: (regionName, height) => set((state) => ({
    regions: state.regions.map(r => 
      r.name === regionName ? { ...r, height: Math.max(50, height) } : r
    )
  })),
  
  items: [],
  addItem: (item) => set((state) => {
    const newState = { items: [...state.items, item] };
    return {
      ...newState,
      history: [...state.history.slice(0, state.historyIndex + 1), { items: newState.items, regions: state.regions }],
      historyIndex: state.historyIndex + 1,
    };
  }),
  
  updateItem: (id, updates) => set((state) => {
    const newState = {
      items: state.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    };
    return {
      ...newState,
      history: [...state.history.slice(0, state.historyIndex + 1), { items: newState.items, regions: state.regions }],
      historyIndex: state.historyIndex + 1,
    };
  }),
  
  deleteSelectedItems: () => set((state) => {
    const newState = {
      items: state.items.filter(item => !item.selected)
    };
    return {
      ...newState,
      history: [...state.history.slice(0, state.historyIndex + 1), { items: newState.items, regions: state.regions }],
      historyIndex: state.historyIndex + 1,
    };
  }),
  
  selectItem: (id, multiSelect = false) => set((state) => ({
    items: state.items.map(item => ({
      ...item,
      selected: item.id === id ? true : (multiSelect ? item.selected : false)
    }))
  })),
  
  clearSelection: () => set((state) => ({
    items: state.items.map(item => ({ ...item, selected: false }))
  })),
  
  history: [{ items: [], regions: DEFAULT_REGIONS }],
  historyIndex: 0,
  
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const prevState = state.history[state.historyIndex - 1];
      return {
        items: prevState.items,
        regions: prevState.regions,
        historyIndex: state.historyIndex - 1,
      };
    }
    return state;
  }),
  
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1];
      return {
        items: nextState.items,
        regions: nextState.regions,
        historyIndex: state.historyIndex + 1,
      };
    }
    return state;
  }),
  
  showReportPropertiesDialog: false,
  setShowReportPropertiesDialog: (show) => set({ showReportPropertiesDialog: show }),
  
  loadTemplate: (template) => set(() => ({
    reportProperties: template.reportProperties,
    regions: template.regions,
    items: template.items,
    history: [{ items: template.items, regions: template.regions }],
    historyIndex: 0,
  })),
  
  getTemplate: () => {
    const state = get();
    return {
      reportProperties: state.reportProperties,
      regions: state.regions,
      items: state.items,
    };
  },
  
  alignItems: (alignment) => set((state) => {
    const selectedItems = state.items.filter(item => item.selected);
    if (selectedItems.length < 2) return state;
    
    let newItems = [...state.items];
    
    if (alignment === 'left') {
      const minX = Math.min(...selectedItems.map(item => item.x));
      newItems = newItems.map(item => 
        item.selected ? { ...item, x: minX } : item
      );
    } else if (alignment === 'center') {
      const avgX = selectedItems.reduce((sum, item) => sum + item.x + (item.properties.width || 100) / 2, 0) / selectedItems.length;
      newItems = newItems.map(item => 
        item.selected ? { ...item, x: avgX - (item.properties.width || 100) / 2 } : item
      );
    } else if (alignment === 'right') {
      const maxX = Math.max(...selectedItems.map(item => item.x + (item.properties.width || 100)));
      newItems = newItems.map(item => 
        item.selected ? { ...item, x: maxX - (item.properties.width || 100) } : item
      );
    } else if (alignment === 'top') {
      const minY = Math.min(...selectedItems.map(item => item.y));
      newItems = newItems.map(item => 
        item.selected ? { ...item, y: minY } : item
      );
    } else if (alignment === 'middle') {
      const avgY = selectedItems.reduce((sum, item) => sum + item.y + (item.properties.height || 30) / 2, 0) / selectedItems.length;
      newItems = newItems.map(item => 
        item.selected ? { ...item, y: avgY - (item.properties.height || 30) / 2 } : item
      );
    } else if (alignment === 'bottom') {
      const maxY = Math.max(...selectedItems.map(item => item.y + (item.properties.height || 30)));
      newItems = newItems.map(item => 
        item.selected ? { ...item, y: maxY - (item.properties.height || 30) } : item
      );
    }
    
    return {
      items: newItems,
      history: [...state.history.slice(0, state.historyIndex + 1), { items: newItems, regions: state.regions }],
      historyIndex: state.historyIndex + 1,
    };
  }),
  
  distributeItems: (direction) => set((state) => {
    const selectedItems = state.items.filter(item => item.selected).sort((a, b) => 
      direction === 'horizontal' ? a.x - b.x : a.y - b.y
    );
    
    if (selectedItems.length < 3) return state;
    
    let newItems = [...state.items];
    
    if (direction === 'horizontal') {
      const first = selectedItems[0];
      const last = selectedItems[selectedItems.length - 1];
      const totalSpace = (last.x + (last.properties.width || 100)) - first.x;
      const totalItemWidth = selectedItems.reduce((sum, item) => sum + (item.properties.width || 100), 0);
      const spacing = (totalSpace - totalItemWidth) / (selectedItems.length - 1);
      
      let currentX = first.x;
      selectedItems.forEach((item, index) => {
        if (index > 0) {
          currentX += (selectedItems[index - 1].properties.width || 100) + spacing;
        }
        newItems = newItems.map(i => i.id === item.id ? { ...i, x: currentX } : i);
      });
    } else {
      const first = selectedItems[0];
      const last = selectedItems[selectedItems.length - 1];
      const totalSpace = (last.y + (last.properties.height || 30)) - first.y;
      const totalItemHeight = selectedItems.reduce((sum, item) => sum + (item.properties.height || 30), 0);
      const spacing = (totalSpace - totalItemHeight) / (selectedItems.length - 1);
      
      let currentY = first.y;
      selectedItems.forEach((item, index) => {
        if (index > 0) {
          currentY += (selectedItems[index - 1].properties.height || 30) + spacing;
        }
        newItems = newItems.map(i => i.id === item.id ? { ...i, y: currentY } : i);
      });
    }
    
    return {
      items: newItems,
      history: [...state.history.slice(0, state.historyIndex + 1), { items: newItems, regions: state.regions }],
      historyIndex: state.historyIndex + 1,
    };
  }),
}));
