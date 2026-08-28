// @vitest-environment node

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * 主入口与 `./type` 出口必须保持平台中立：React Native 侧会从 `@skyroc/utils` 与 `@skyroc/utils/type` 导入，一旦这里泄漏 DOM 全局类型，无 DOM lib
 * 的环境就会编译失败。
 *
 * Tsconfig 的中立项目（lib 只有 ESNext、exclude `src/web`）已经能在编译期挡住绝大多数 泄漏，但类型断言无法表达「某个 barrel 没有导出什么」，所以这一层用源码静态检查兜底。
 */

const SRC_DIR = fileURLToPath(new URL('../src', import.meta.url));
const TYPE_DIR = fileURLToPath(new URL('../src/type', import.meta.url));

/** 只出现在浏览器环境的全局类型名 */
const DOM_GLOBALS = /\b(?:HTML[A-Za-z]*Element|FileList|HTMLOptionsCollection|Document|Window|ShadowRoot)\b/;

function readSources(dir: string, prefix = '') {
  return readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.ts'))
    .map(entry => ({ content: readFileSync(join(dir, entry.name), 'utf8'), name: `${prefix}${entry.name}` }));
}

function readNeutralSources() {
  return [...readSources(SRC_DIR), ...readSources(TYPE_DIR, 'type/')];
}

describe('平台中立出口', () => {
  it('src 根层级不引用任何 DOM 全局类型', () => {
    const offenders = readNeutralSources()
      .filter(file => DOM_GLOBALS.test(file.content))
      .map(file => file.name);

    expect(offenders).toEqual([]);
  });

  it('src 根层级不引入 ./web 子树', () => {
    const offenders = readNeutralSources()
      .filter(file => /from\s+'\.\/web/.test(file.content))
      .map(file => file.name);

    expect(offenders).toEqual([]);
  });

  it('web 子树确实是独立入口', () => {
    const webIndex = readFileSync(join(SRC_DIR, 'web/index.ts'), 'utf8');

    expect(webIndex).toContain("from './form'");
  });
});
