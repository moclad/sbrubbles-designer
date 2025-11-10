# Report Template Designer

A React + TypeScript application for designing report templates based on Microsoft Report Definition Language (RDL) Schema Version 2008.

## Features

- **Visual Report Designer**: Drag-and-drop interface with canvas, toolbox, and properties panel
- **Plugin System**: Configuration-driven report items (TextBox, SingleField, Table, Image, Matrix, QRCode)
- **RDL Export**: Export reports to valid RDL 2008 XML format
- **Template Persistence**: Save and load templates as JSON
- **Alignment Tools**: Multi-select alignment and distribution utilities
- **Keyboard Shortcuts**: Full keyboard support for efficient editing
- **Responsive Regions**: Resizable Header, Body, and Footer sections

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
cd designer-app
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173` (or another port if 5173 is in use).

### Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview

Preview the production build:

```bash
npm run preview
```

## Usage

### Basic Workflow

1. **Add Items**: Drag items from the left toolbox onto the canvas
2. **Configure Properties**: Select items and edit properties in the right panel
3. **Arrange Items**: Use toolbar buttons to align and distribute multiple selected items
4. **Set Report Properties**: Click the settings icon to configure page size, orientation, and margins
5. **Save Template**: Click Save to download the template as JSON
6. **Export RDL**: Click Export to generate an RDL file

### Keyboard Shortcuts

- **Delete**: Remove selected items
- **Arrow Keys**: Nudge selected items by 1px
- **Shift + Arrow Keys**: Nudge selected items by 10px
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y** or **Ctrl/Cmd + Shift + Z**: Redo
- **Shift + Click**: Multi-select items

### Canvas Regions

The canvas is divided into three vertical regions:

- **Header**: Appears at the top of each page
- **Body**: Main content area
- **Footer**: Appears at the bottom of each page

Each region can be resized by dragging the blue handle at the bottom of the Header and Footer regions.

## Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── canvas/         # Canvas and region components
│   ├── dialogs/        # Modal dialogs
│   ├── items/          # Report item renderers
│   ├── properties/     # Properties panel
│   ├── toolbar/        # Top toolbar
│   ├── toolbox/        # Left toolbox
│   └── ui/             # shadcn/ui components
├── examples/           # Example templates
├── lib/                # Utility libraries
├── plugins/            # Plugin configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (RDL export, etc.)
├── store.ts            # Zustand state management
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Plugin System

The plugin system is configuration-driven. All available report items are defined in `src/plugins/plugin-config.json`.

Each plugin definition includes:
- **id**: Unique identifier
- **displayName**: Human-readable name
- **icon**: Lucide React icon name
- **defaultProperties**: Default values for all properties
- **propertyTypes**: Schema defining editable properties

### Adding New Plugins

To add a new plugin:

1. Add a plugin definition to `src/plugins/plugin-config.json`:

```json
{
  "id": "myitem",
  "displayName": "My Item",
  "icon": "Box",
  "defaultProperties": {
    "width": 100,
    "height": 50,
    "text": "Hello"
  },
  "propertyTypes": {
    "width": { "type": "number", "label": "Width", "min": 10, "max": 1000 },
    "height": { "type": "number", "label": "Height", "min": 10, "max": 1000 },
    "text": { "type": "text", "label": "Text" }
  }
}
```

2. Create a renderer component in `src/components/items/`:

```typescript
export function MyItemComponent({ properties }: { properties: Record<string, any> }) {
  return (
    <div style={{ width: properties.width, height: properties.height }}>
      {properties.text}
    </div>
  );
}
```

3. Add the renderer to `ReportItemRenderer.tsx`:

```typescript
case 'myitem':
  return <MyItemComponent properties={item.properties} />;
```

### Property Types

Supported property types:
- **text**: Text input
- **number**: Numeric input with optional min/max
- **color**: Color picker
- **select**: Dropdown with predefined options
- **boolean**: Yes/No selector
- **dataField**: Dropdown populated with sample data fields

### State Management

The application uses Zustand for state management. The main store (`src/store.ts`) manages:
- Plugin registry
- Report properties
- Canvas regions
- Report items
- Selection state
- Undo/redo history

### RDL Export

The RDL export functionality (`src/utils/rdl-export.ts`) generates valid RDL 2008 XML. The exported file includes:
- Page dimensions and margins
- Header, Body, and Footer sections
- Report items with position and properties
- Basic styling (fonts, colors, alignment)

**Note**: The RDL export focuses on structure and positioning. Complex data binding and advanced RDL features are not implemented.

## Technology Stack

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **Zustand**: State management
- **Lucide React**: Icon library
- **qrcode.react**: QR code generation

## Known Limitations

1. **RDL Export**: The exported RDL is simplified and may not include all features of a full RDL 2008 document
2. **Data Binding**: Data fields are placeholders only; no actual data binding is implemented
3. **Rendering Engine**: This is a designer only; it does not include a report rendering engine
4. **Table/Matrix Complexity**: Table and Matrix items are simplified representations
5. **Image Handling**: Images require external URLs; no built-in image upload

## Example Templates

An example invoice template is included at `src/examples/example-template.json`. Load it via the "Load Example" button in the toolbar.

## License

MIT

## Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.
