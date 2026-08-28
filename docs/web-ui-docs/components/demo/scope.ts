import * as WebUI from '@skyroc/web-ui';
import Schema from 'async-validator';
import * as Lucide from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';

/**
 * React-live 通过 `new Function(...scopeKeys, code)` 执行 demo， scope 的 key 会被当作函数参数名，所以必须过滤掉 JS 保留字与非法标识符， 否则会得到
 * `SyntaxError: Unexpected token 'default'`（ESM interop 的 `default` 键就是凶手）。
 */
const RESERVED = new Set([
  'default',
  'arguments',
  'eval',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield'
]);

const IDENT_RE = /^[$A-Z_a-z][\w$]*$/;

interface DemoInputProps extends React.ComponentProps<'input'> {
  /** 关联的表单字段名，用于展示字段状态 */
  name: string;
}

function safeAssign(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const key of Object.keys(source)) {
    if (!RESERVED.has(key) && IDENT_RE.test(key)) {
      target[key] = source[key];
    }
  }
}

function showToastCode(title: string, values: unknown) {
  WebUI.toast(title, {
    className: '!w-[400px]',
    description: React.createElement(
      'pre',
      { className: 'mt-2 w-[360px] rounded-md bg-neutral-950 p-4 max-sm:w-screen' },
      React.createElement(
        'code',
        { className: 'text-white' },
        JSON.stringify(values, (_, value) => (value === undefined ? null : value), 2)
      )
    ),
    position: 'top-center'
  });
}

const DemoInput = (props: DemoInputProps) => {
  const { name, ...rest } = props;

  const state = WebUI.useFieldState(name);
  const { touched, validated, validating } = state;

  return React.createElement(
    React.Fragment,
    null,
    React.createElement('input', {
      className:
        'border-input bg-background focus-visible:ring-offset-background focus-visible:ring-primary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-8 w-full rounded-md border border-solid px-2.5 text-sm file:border-0 file:bg-transparent file:py-1.25 file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      ...rest
    }),
    React.createElement(
      'div',
      { className: 'flex gap-x-4' },
      touched ? React.createElement('span', { className: 'text-blue-400' }, 'touched') : null,
      validated ? React.createElement('span', { className: 'text-red-400' }, 'validated') : null,
      validating ? React.createElement('span', { className: 'text-yellow-400' }, 'validating') : null
    )
  );
};

DemoInput.displayName = 'DemoInput';

const scope: Record<string, unknown> = { React };

safeAssign(scope, React as unknown as Record<string, unknown>);
safeAssign(scope, Lucide as unknown as Record<string, unknown>);
safeAssign(scope, WebUI as unknown as Record<string, unknown>);
safeAssign(scope, {
  DemoInput,
  Schema,
  z,
  showToastCode
});

export const demoScope = scope;

export const scopeKeys: ReadonlySet<string> = new Set(Object.keys(demoScope));
