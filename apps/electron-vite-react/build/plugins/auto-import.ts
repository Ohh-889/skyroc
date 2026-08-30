import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';

import { LOCAL_ICON_COLLECTION } from './icon-utils.ts';

const SOURCE_FILE_RE = /\.[tj]sx?(\?.*)?$/;

function autoImportSkyroc(componentName: string) {
  const pattern = /^S[A-Z]/;

  if (pattern.test(componentName)) {
    return { from: '@skyroc/web-ui', name: componentName.slice(1) };
  }

  return null;
}

export function setupAutoImportPlugin() {
  return AutoImport({
    dts: 'src/types/auto-imports.d.ts',
    imports: [
      {
        from: 'react',
        imports: ['useContext', 'useEffect', 'useId', 'useMemo', 'useRef', 'useState']
      },
      {
        from: 'jotai',
        imports: ['atom', 'createStore', 'useAtom', 'useAtomValue', 'useSetAtom']
      }
    ],
    include: [SOURCE_FILE_RE],
    resolvers: [
      autoImportSkyroc,
      IconsResolver({
        componentPrefix: 'icon',
        customCollections: [LOCAL_ICON_COLLECTION],
        extension: 'tsx',
        prefix: 'icon'
      })
    ]
  });
}
