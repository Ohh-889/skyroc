# @soybean/ui

A modern React UI component library for SoybeanAdmin - built with TypeScript, React 19, and designed for enterprise applications.

## Features

- 🎨 **Modern Design** - Clean and professional UI components
- 📦 **TypeScript First** - Full TypeScript support with comprehensive type definitions
- ⚡ **Tree-shakeable** - Optimized bundle size with ES modules
- 🔧 **Customizable** - Easy to customize with Tailwind CSS and CSS variables
- 🎯 **React 19** - Built with the latest React features
- 📱 **Responsive** - Mobile-friendly components
- ♿ **Accessible** - WCAG compliant components

## Installation

```bash
# Using pnpm (recommended)
pnpm add @soybean/ui

# Using npm
npm install @soybean/ui

# Using yarn
yarn add @soybean/ui
```

## Usage

```tsx
import { SomeComponent } from '@soybean/ui';
// Or import specific submodules
import { useExample } from '@soybean/ui/hooks';
import { helperFunction } from '@soybean/ui/utils';

function App() {
  return (
    <div>
      <SomeComponent />
    </div>
  );
}
```

## Available Exports

### Components

Components will be added as the library develops.

### Hooks

Custom React hooks for common UI patterns:

- Import from `@soybean/ui/hooks`

### Utils

Utility functions for component development:

- Import from `@soybean/ui/utils`

## Development

This package is part of the SoybeanAdmin monorepo.

### Setup

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### Project Structure

```
ui-kit/ui/
├── src/
│   ├── components/     # UI components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── index.ts       # Main entry point
├── dist/              # Build output (generated)
├── tsdown.config.ts   # Build configuration
├── tsconfig.json      # TypeScript configuration
├── eslint.config.js   # ESLint configuration
└── package.json       # Package manifest
```

### Build System

This package uses [tsdown](https://github.com/sxzz/tsdown) for building:

- Fast builds with esbuild
- Automatic type generation
- Tree-shakeable output
- Preserves directory structure (unbundle mode)

## Peer Dependencies

- React >= 18.0.0
- React DOM >= 18.0.0

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines in the main repository.

## Links

- [GitHub Repository](https://github.com/soybeanjs/soybean-admin-react)
- [Documentation](https://github.com/soybeanjs/soybean-admin-react/tree/main/ui-kit/ui)
- [Issues](https://github.com/soybeanjs/soybean-admin-react/issues)
