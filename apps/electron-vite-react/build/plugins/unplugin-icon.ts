import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import { LOCAL_ICON_COLLECTION, LOCAL_ICON_PATH, LOCAL_ICON_PREFIX, transformLocalIcon } from './icon-utils.ts';

export function setupUnpluginIconPlugins() {
  return [
    createSvgIconsPlugin({
      customDomId: '__SVG_ICON_LOCAL__',
      iconDirs: [LOCAL_ICON_PATH],
      inject: 'body-last',
      symbolId: `${LOCAL_ICON_PREFIX}-[dir]-[name]`
    }),
    Icons({
      compiler: 'jsx',
      customCollections: {
        [LOCAL_ICON_COLLECTION]: FileSystemIconLoader(LOCAL_ICON_PATH, transformLocalIcon)
      },
      defaultClass: 'inline-block',
      jsx: 'react',
      scale: 1
    })
  ];
}
