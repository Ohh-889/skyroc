/**
 * 校验 `src/app`（路由骨架）与 `src/pages`（页面实现）严格一一对应。
 *
 * expo-router 会把 `src/app` 下的**每个** `.tsx` 都注册成路由，且对缺少 default export 的文件
 * 只 `console.warn` 不剔除（见 expo-router/build/getRoutesCore.js）。所以页面私有组件一旦写进
 * `src/app`，就会变成幽灵路由污染 `Href` 类型和 `/_sitemap`。
 *
 * 本脚本据此强制三条约束：
 *   1. `src/app` 下除 layout 和 expo-router 特殊文件外，只能是一行转发；
 *   2. 每个转发都能在 `src/pages` 找到同路径的页面；
 *   3. `src/pages` 里的每个页面都有对应路由（`modules/` 下的私有组件除外）。
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');

const APP_DIR = join(ROOT, 'src', 'app');

const PAGES_DIR = join(ROOT, 'src', 'pages');

/** 页面私有组件目录，不参与路由对应关系 */
const MODULES_DIR = 'modules';

/**
 * expo-router 自己就会跳过的文件，不算路由。
 *
 * `+html` / `+native-intent` 来自 getRoutesCore 的 ignoreList，`+api` / `+middleware` 来自
 * `_ctx` 的 require.context 正则；`+not-found` 是真实路由但内容通常就地写完，不强制走 pages。
 */
const NON_ROUTE_PATTERNS = [
  /(^|[\\/])_layout\.[jt]sx?$/,
  /(^|[\\/])\+html\.[jt]sx?$/,
  /(^|[\\/])\+native-intent\.[jt]sx?$/,
  /(^|[\\/])\+middleware\.[jt]sx?$/,
  /(^|[\\/])\+not-found\.[jt]sx?$/,
  /\+api\.[jt]sx?$/
];

/** 转发文件里允许出现的唯一语句形态 */
const SHIM_PATTERN = /^export\s+(?:\*|\{[^}]*\})\s+from\s+'(@\/pages\/[^']+)';$/;

const errors: string[] = [];

function walk(dir: string): string[] {
  let entries: string[] = [];

  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }

  return entries.flatMap(entry => {
    const full = join(dir, entry);

    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** 去掉扩展名的仓库内相对路径，例如 `(auth)/login` */
function toKey(file: string, base: string) {
  return relative(base, file)
    .split(sep)
    .join('/')
    .replace(/\.[jt]sx?$/, '');
}

// ---------- 1. app → pages ----------

const routeFiles = walk(APP_DIR).filter(
  file => /\.[jt]sx?$/.test(file) && !NON_ROUTE_PATTERNS.some(pattern => pattern.test(file))
);

const pageFiles = walk(PAGES_DIR).filter(
  file => /\.tsx?$/.test(file) && !relative(PAGES_DIR, file).split(sep).includes(MODULES_DIR)
);

const pageKeys = new Set(pageFiles.map(file => toKey(file, PAGES_DIR)));

/** 一个路由 key 对应的页面可以是 `key.tsx`，也可以是 `key/index.tsx`（需要 modules/ 时的形态） */
function resolvePageKey(key: string) {
  if (pageKeys.has(key)) return key;

  if (pageKeys.has(`${key}/index`)) return `${key}/index`;

  return null;
}

const referenced = new Map<string, string[]>();

for (const file of routeFiles) {
  const key = toKey(file, APP_DIR);

  const display = `src/app/${relative(APP_DIR, file).split(sep).join('/')}`;

  const lines = readFileSync(file, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '' && !line.startsWith('//'));

  const specifiers: string[] = [];

  for (const line of lines) {
    const matched = SHIM_PATTERN.exec(line);

    if (!matched) {
      errors.push(`${display} 不是纯转发文件。页面实现要放进 src/pages，这里只留 export ... from '@/pages/...'`);
      break;
    }

    specifiers.push(matched[1]);
  }

  if (specifiers.length === 0) continue;

  const expected = `@/pages/${key}`;

  for (const specifier of specifiers) {
    if (specifier !== expected) {
      errors.push(`${display} 转发到了 ${specifier}，与路由路径不对应，应为 ${expected}`);
      continue;
    }

    const resolved = resolvePageKey(key);

    if (!resolved) {
      errors.push(`${display} 找不到对应页面，需要新建 src/pages/${key}.tsx 或 src/pages/${key}/index.tsx`);
      continue;
    }

    referenced.set(resolved, [...(referenced.get(resolved) ?? []), display]);
  }
}

// ---------- 2. pages → app ----------

for (const key of pageKeys) {
  if (referenced.has(key)) continue;

  // `x/index.tsx` 既可能挂在路由 `x/index` 上，也可能挂在 `x` 上
  const alias = key.replace(/\/index$/, '');

  if (alias !== key && referenced.has(alias)) continue;

  errors.push(`src/pages/${key}.tsx 没有任何路由引用。补一个转发文件，或者删掉它`);
}

// ---------- 3. 重复引用 ----------

for (const [key, sources] of referenced) {
  if (sources.length > 1) {
    errors.push(`src/pages/${key}.tsx 被多个路由引用：${sources.join('、')}`);
  }
}

if (errors.length > 0) {
  console.error(`\n路由与页面对应关系校验失败（${errors.length} 项）：\n`);
  errors.forEach(error => console.error(`  ✗ ${error}`));
  console.error('');
  process.exit(1);
}

console.log(`✓ 路由与页面一一对应（${routeFiles.length} 个路由 / ${pageKeys.size} 个页面）`);
