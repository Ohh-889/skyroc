import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

import { setupAutoImportPlugin } from './auto-import.ts';
import { setupBabelPlugin } from './babel.ts';
import { setupProjectInfoPlugin } from './info.ts';
import { setupRouterPlugin } from './router.ts';
import { setupUnpluginIconPlugins } from './unplugin-icon.ts';

export function setupRendererPlugins() {
  return [
    setupRouterPlugin(),
    react(),
    setupBabelPlugin(),
    tailwindcss(),
    ...setupUnpluginIconPlugins(),
    setupAutoImportPlugin(),
    setupProjectInfoPlugin()
  ];
}
