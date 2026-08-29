import path from 'node:path';

export const LOCAL_ICON_COLLECTION = 'local';
export const LOCAL_ICON_PREFIX = 'icon-local';
export const LOCAL_ICON_PATH = path.join(import.meta.dirname, '../../src/assets/svg-icon');

export function transformLocalIcon(svg: string) {
  return svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ');
}
