import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

import { setupAutoImportPlugin } from './auto-import';
import { setupBabelPlugin } from './babel';
import { setupProjectInfoPlugin } from './info';
import { setupRouterPlugin } from './router';
import { setupUnpluginIconPlugins } from './unplugin-icon';

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
