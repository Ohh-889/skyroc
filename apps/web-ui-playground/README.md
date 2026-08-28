# Skyroc UI Playground

[English](./README.md) | [简体中文](./README.zh.md)

Interactive component showcase and testing environment for Skyroc UI. Built with Next.js 15, this playground provides a comprehensive development and testing platform for all components.

## Overview

The Playground is a Next.js application that serves multiple purposes:

- **Component Showcase** - Browse and interact with 50+ Skyroc UI components
- **Live Examples** - See components in action with real-world use cases
- **Development Environment** - Test new components and features in isolation
- **Code Reference** - View implementation details and source code for each demo

## Quick Start

```bash
# Install dependencies (if not already installed)
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

## Available Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build for production     |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |

## Project Structure

```
playground/
├── src/
│   ├── app/
│   │   ├── (demo)/          # Component demos
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── card/
│   │   │   └── ...          # 50+ component demos
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Playground-specific components
│   ├── config.ts            # Configuration
│   └── css/                 # Styles
├── public/                  # Static assets
└── next.config.ts          # Next.js configuration
```

## Component Demos

All component demonstrations are located in `src/app/(demo)/`. Each component has its own directory containing:

- Multiple usage examples
- Different variants and states
- Interactive demos
- Edge cases and error handling

### Adding New Demos

1. Create a new directory under `src/app/(demo)/[component-name]/`
2. Add demo modules in `modules/` subdirectory
3. Create a `page.tsx` to showcase the demos
4. Update `components-meta.ts` if needed

## Features

- **Hot Reload** - Instant feedback during development
- **TypeScript** - Full type safety across all demos
- **Responsive** - Test components on different screen sizes
- **Theme Switching** - Toggle between light and dark modes
- **Code Highlighting** - Syntax-highlighted code examples

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: Skyroc UI (workspace package)
- **Styling**: Tailwind CSS 4
- **TypeScript**: Full type support
- **Icons**: Lucide React

## Deployment

The playground can be deployed to various platforms:

### Vercel (Recommended)

```bash
# Deploy to Vercel
pnpm deploy:playground
```

### Cloudflare Pages

```bash
# Build for Cloudflare
pnpm build
```

Configuration is available in `wrangler.jsonc` and `open-next.config.ts`.

## Contributing

When adding new components to Skyroc UI, please also:

1. Add comprehensive demos in the playground
2. Include multiple usage examples
3. Document edge cases
4. Test across different themes

## License

MIT License © 2024-PRESENT [Ohh](https://github.com/Ohh-889)
