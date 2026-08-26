import { describe, expect, it } from 'vitest';

import { resolveTemplateName } from '../src/cli';
import { detectPackageManager, getPackageManagerCommands } from '../src/shared/package-manager';

describe('template selection', () => {
  it('keeps admin as the non-interactive default', () => {
    expect(resolveTemplateName(undefined, false)).toBe('admin');
  });

  it('leaves selection to the prompt when no name and no template are supplied', () => {
    expect(resolveTemplateName(undefined, true)).toBeUndefined();
  });

  it('accepts Expo and rejects unknown templates', () => {
    expect(resolveTemplateName('expo', false)).toBe('expo');
    expect(() => resolveTemplateName('vue', false)).toThrow('Unknown template');
  });
});

describe('package manager commands', () => {
  it.each([
    ['npm/11.0.0 node/v22', 'npm'],
    ['yarn/1.22.22 npm/? node/v22', 'yarn'],
    ['pnpm/10.4.1 npm/? node/v22', 'pnpm'],
    ['bun/1.2.0', 'bun']
  ] as const)('detects %s', (userAgent, expected) => {
    expect(detectPackageManager(userAgent)).toBe(expected);
  });

  it('uses npm run for npm scripts', () => {
    expect(getPackageManagerCommands('npm', 'dev')).toEqual({ install: 'npm install', start: 'npm run dev' });
  });

  it('uses the selected script for Expo', () => {
    expect(getPackageManagerCommands('yarn', 'start')).toEqual({ install: 'yarn', start: 'yarn start' });
    expect(getPackageManagerCommands('pnpm', 'start')).toEqual({ install: 'pnpm install', start: 'pnpm start' });
  });
});
