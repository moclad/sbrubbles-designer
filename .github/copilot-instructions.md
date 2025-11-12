# GitHub Copilot Instructions for sbrubbles-designer

## Project Overview

This is a **Report Template Designer** - a visual designer application for creating Microsoft RDL (Report Definition Language) 2008 reports. It provides a drag-and-drop interface for designing report templates with various report items (TextBox, Table, Image, QRCode, Matrix, etc.).

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3 + shadcn/ui components
- **State Management**: Zustand
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier

## Repository Structure

```
/
├── README.md                 # Root documentation
└── designer-app/             # Main application directory
    ├── src/
    │   ├── components/       # React components
    │   │   ├── canvas/       # Canvas and region rendering
    │   │   ├── dialogs/      # Modal dialogs
    │   │   ├── items/        # Report item renderers
    │   │   ├── properties/   # Properties panel
    │   │   ├── toolbar/      # Top toolbar
    │   │   ├── toolbox/      # Left toolbox
    │   │   └── ui/           # shadcn/ui components
    │   ├── examples/         # Example templates
    │   ├── lib/              # Utility libraries
    │   ├── plugins/          # Plugin configuration
    │   ├── types/            # TypeScript types
    │   ├── utils/            # Utility functions (RDL export, etc.)
    │   ├── store.ts          # Zustand state management
    │   ├── App.tsx           # Main application
    │   └── main.tsx          # Entry point
    ├── public/               # Static assets
    └── package.json          # Dependencies and scripts
```

## Key Architectural Concepts

### Plugin System

The application uses a **configuration-driven plugin system**. All report items are defined in `src/plugins/plugin-config.json`:

- Each plugin has an `id`, `displayName`, `icon`, `defaultProperties`, and `propertyTypes`
- Property types supported: `text`, `number`, `color`, `select`, `boolean`, `dataField`
- Plugins are automatically loaded and rendered based on configuration

When adding a new plugin:
1. Add definition to `plugin-config.json`
2. Create renderer component in `src/components/items/`
3. Add case to `ReportItemRenderer.tsx`

### State Management

The application uses **Zustand** for centralized state management (`src/store.ts`):
- Plugin registry
- Report properties (title, author, paper size, orientation, margins)
- Canvas regions (header, body, footer)
- Report items (positioned on canvas)
- Selection state (multi-select supported)
- Undo/redo history

### Core Data Types

Located in `src/types/index.ts`:
- `PluginConfig`: Plugin definition
- `ReportItem`: Instance of a plugin on the canvas
- `ReportProperties`: Report-level configuration
- `CanvasRegion`: Header/Body/Footer sections
- `TemplateState`: Complete template state for save/load

### Canvas Regions

Reports are divided into three vertical regions:
- **Header**: Top section, appears on each page
- **Body**: Main content area
- **Footer**: Bottom section, appears on each page

Each region is independently sized and can contain report items.

## Code Style and Conventions

### TypeScript

- Use TypeScript strict mode
- Define interfaces in `src/types/index.ts`
- Prefer `interface` over `type` for object definitions
- Use `Record<string, any>` for plugin properties (dynamic nature)

### React Components

- Functional components only (no class components)
- Use React 19 features (no legacy patterns)
- Components export as named exports (e.g., `export function ComponentName`)
- Props are defined inline or as interfaces
- Use React hooks (useState, useEffect, etc.) as needed

### Styling

- **Tailwind CSS** for all styling (utility-first approach)
- Use shadcn/ui components from `src/components/ui/`
- Inline styles only when dynamic (e.g., item positioning, user-defined colors)
- Follow existing Tailwind class patterns in components

### File Naming

- React components: PascalCase with `.tsx` extension
- Utilities: camelCase with `.ts` extension
- Types: `index.ts` in `types/` directory
- JSON configs: kebab-case (e.g., `plugin-config.json`)

### Code Formatting

Prettier configuration (`.prettierrc.json`):
- 2 spaces indentation
- Single quotes
- Semicolons required
- 100 character line width
- ES5 trailing commas

**Always run `npm run format` after making changes.**

## Development Workflow

### Setup

```bash
cd designer-app
npm install
```

### Development Server

```bash
npm run dev
# Opens at http://localhost:5173
```

### Build

```bash
npm run build
# Outputs to designer-app/dist/
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Testing

**Note**: This project currently has no automated tests. When suggesting test additions, consider:
- No test runner is configured
- Adding tests would require setup (Jest, Vitest, or React Testing Library)
- Focus on manual testing via the development server

## RDL Export

The `src/utils/rdl-export.ts` file handles exporting templates to RDL 2008 XML format. Key points:
- Exports valid RDL 2008 XML structure
- Focuses on layout and positioning
- Does not implement complex data binding or advanced RDL features
- Simplified representation suitable for report structure definition

## Common Tasks

### Adding a New Report Item Type

1. Update `src/plugins/plugin-config.json` with new plugin definition
2. Create renderer component in `src/components/items/NewItem.tsx`
3. Add case in `src/components/items/ReportItemRenderer.tsx`
4. Test by dragging from toolbox onto canvas

### Adding a New Property Type

1. Update `PropertyType` interface in `src/types/index.ts`
2. Add handler in properties panel component
3. Update RDL export if the property affects output

### Modifying Canvas Behavior

- Canvas logic is in `src/components/canvas/`
- Item positioning uses absolute positioning with x, y coordinates
- Selection and drag-and-drop handled in canvas components

### State Management Changes

- All state modifications go through Zustand actions in `src/store.ts`
- Use `useStore` hook to access state in components
- History is automatically managed for undo/redo

## Important Notes

### Current Limitations

- No automated tests (manual testing only)
- RDL export is simplified (not full RDL 2008 feature set)
- No actual data binding (fields are placeholders)
- No report rendering engine (designer only)
- Images require external URLs (no upload functionality)

### Dependencies

- Keep React and related packages in sync
- Tailwind CSS 3.x (note: not v4 yet)
- TypeScript ~5.9.3 (use compatible versions)
- Vite 7.x for build tooling

### Best Practices

1. **Minimal Changes**: Make surgical, focused changes to existing code
2. **Plugin-First**: Use plugin system for extensibility rather than hardcoding
3. **Type Safety**: Leverage TypeScript, avoid `any` where possible (except plugin properties)
4. **Component Isolation**: Keep components focused and reusable
5. **State Centralization**: Use Zustand store, avoid local state for shared data
6. **Consistent Styling**: Follow Tailwind utility patterns from existing components

## Getting Help

- Main README: `/README.md`
- App README: `/designer-app/README.md`
- Example template: `src/examples/example-template.json`
- Plugin config: `src/plugins/plugin-config.json`
- Type definitions: `src/types/index.ts`

## License

MIT License - see repository root for details.
