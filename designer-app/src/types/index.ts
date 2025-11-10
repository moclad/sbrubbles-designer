// Plugin types
export interface PluginConfig {
  id: string;
  displayName: string;
  icon: string;
  defaultProperties: Record<string, any>;
  propertyTypes: Record<string, PropertyType>;
}

export interface PropertyType {
  type: 'text' | 'number' | 'color' | 'select' | 'boolean' | 'dataField';
  label: string;
  min?: number;
  max?: number;
  options?: string[];
}

// Report item instance
export interface ReportItem {
  id: string;
  pluginId: string;
  x: number;
  y: number;
  region: 'header' | 'body' | 'footer';
  properties: Record<string, any>;
  selected?: boolean;
}

// Report properties
export interface ReportProperties {
  title: string;
  author: string;
  paperSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Canvas region
export interface CanvasRegion {
  name: 'header' | 'body' | 'footer';
  height: number;
}

// Template state
export interface TemplateState {
  reportProperties: ReportProperties;
  regions: CanvasRegion[];
  items: ReportItem[];
}

// Sample data fields
export const SAMPLE_DATA_FIELDS = [
  'customer.name',
  'customer.email',
  'customer.phone',
  'order.id',
  'order.date',
  'order.total',
  'product.name',
  'product.price',
  'product.quantity',
  'company.name',
  'company.address',
  'invoice.number',
  'invoice.date',
  'invoice.dueDate',
];

// Paper sizes in points (1 inch = 72 points)
export const PAPER_SIZES = {
  A4: {
    portrait: { width: 595, height: 842 },
    landscape: { width: 842, height: 595 },
  },
  Letter: {
    portrait: { width: 612, height: 792 },
    landscape: { width: 792, height: 612 },
  },
};
