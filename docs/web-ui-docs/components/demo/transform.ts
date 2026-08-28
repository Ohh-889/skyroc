/**
 * 将 playground 的 demo `.tsx` 源码转换成 react-live 可执行的代码片段。
 *
 * 输入示例： 'use client'; import { Button } from '@skyroc/web-ui'; const ButtonColor = () => (<Button>Hi</Button>); export
 * default ButtonColor;
 *
 * 产出：
 *
 * - Display: 保留 import 让用户在编辑器看到完整上下文
 * - Executable: 剥掉 import / 'use client' / export，末尾追加 render(<X />)
 * - ComponentName / externalImports
 */

const IMPORT_RE = /^\s*import\s+(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"];?\s*$/gm;
const NAMED_IMPORT_RE = /import\s+(?:([\w$]+)\s*,\s*)?\{([^}]+)\}\s+from\s+['"][^'"]+['"];?/g;
const DEFAULT_IMPORT_RE = /import\s+([\w$]+)\s+from\s+['"][^'"]+['"];?/g;
const NAMESPACE_IMPORT_RE = /import\s+\*\s+as\s+([\w$]+)\s+from\s+['"][^'"]+['"];?/g;
const USE_CLIENT_RE = /^\s*['"]use client['"];?\s*\n+/;
const EXPORT_DEFAULT_DECL_RE = /export\s+default\s+(?:function\s+([\w$]+)|class\s+([\w$]+))/;
const EXPORT_DEFAULT_IDENT_RE = /^\s*export\s+default\s+([\w$]+)\s*;?\s*$/m;
const EXPORT_NAMED_DECL_RE = /export\s+(const|let|var|function|class)\s+([\w$]+)/g;

export interface TransformResult {
  /** 主组件名 */
  componentName: string;
  /** 原汁原味（剥 use client）— 给 LiveEditor 显示 */
  display: string;
  /** 喂给 react-live 的代码 — 已剥 import / export，末尾有 render(...) */
  executable: string;
  /** Demo 里 import 的所有非相对模块 */
  externalModules: string[];
  /** Demo 里 import 但 scope 没提供的标识符 */
  missingIdentifiers: string[];
}

function collectImportedIdentifiers(src: string): { idents: Set<string>; modules: Set<string> } {
  const idents = new Set<string>();
  const modules = new Set<string>();

  const moduleMatches = src.matchAll(IMPORT_RE);
  for (const m of moduleMatches) {
    modules.add(m[1]);
  }

  for (const m of src.matchAll(NAMED_IMPORT_RE)) {
    if (m[1]) idents.add(m[1]);
    for (const part of m[2].split(',')) {
      const name =
        part
          .trim()
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[1] // 有 alias 取后者
          ?.trim() ?? part.trim().replace(/^type\s+/, '');
      if (name) idents.add(name);
    }
  }

  for (const m of src.matchAll(NAMESPACE_IMPORT_RE)) {
    idents.add(m[1]);
  }

  for (const m of src.matchAll(DEFAULT_IMPORT_RE)) {
    // DEFAULT_IMPORT_RE 会跟 NAMED_IMPORT_RE 重叠，过滤掉只 default 的
    if (!m[0].includes('{') && !m[0].includes('* as')) {
      idents.add(m[1]);
    }
  }

  return { idents, modules };
}

function stripImportsAndExports(src: string): { code: string; componentName: string } {
  let code = src;
  let componentName = 'Demo';

  // 1) 剥 'use client'
  code = code.replace(USE_CLIENT_RE, '');

  // 2) 找出 default export 的组件名
  const declMatch = code.match(EXPORT_DEFAULT_DECL_RE);
  if (declMatch) {
    componentName = declMatch[1] || declMatch[2] || componentName;
    // export default function Foo() {} → function Foo() {}
    code = code.replace(/export\s+default\s+/, '');
  } else {
    const identMatch = code.match(EXPORT_DEFAULT_IDENT_RE);
    if (identMatch) {
      componentName = identMatch[1];
      code = code.replace(EXPORT_DEFAULT_IDENT_RE, '');
    }
  }

  // 3) export const/let/var/function/class Foo → const Foo
  if (componentName === 'Demo') {
    const exportNamed = [...code.matchAll(EXPORT_NAMED_DECL_RE)];
    if (exportNamed.length > 0) {
      componentName = exportNamed[exportNamed.length - 1][2];
    }
  }
  code = code.replace(EXPORT_NAMED_DECL_RE, '$1 $2');

  // 4) 剥所有 import 行
  code = code.replace(IMPORT_RE, '');

  // 5) 清理多余空行
  code = code.replace(/\n{3,}/g, '\n\n').trim();

  return { code, componentName };
}

export function transformDemo(rawSrc: string, scopeKeys: ReadonlySet<string>): TransformResult {
  const display = rawSrc.replace(USE_CLIENT_RE, '').trim();

  const { idents, modules } = collectImportedIdentifiers(rawSrc);
  const { code, componentName } = stripImportsAndExports(rawSrc);

  const missingIdentifiers = [...idents].filter(name => !scopeKeys.has(name));
  const externalModules = [...modules].filter(m => !m.startsWith('.') && !m.startsWith('/'));

  const executable = `{\n${code}\n\nrender(<${componentName} />);\n}\n`;

  return {
    display,
    executable,
    componentName,
    missingIdentifiers,
    externalModules
  };
}
