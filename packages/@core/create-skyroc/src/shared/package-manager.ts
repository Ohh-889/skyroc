import process from 'node:process';

export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';

export function detectPackageManager(userAgent = process.env.npm_config_user_agent): PackageManager {
  const name = userAgent?.split(' ')[0]?.split('/')[0];

  if (name === 'npm' || name === 'yarn' || name === 'pnpm' || name === 'bun') {
    return name;
  }

  return 'pnpm';
}

export function getPackageManagerCommands(packageManager: PackageManager, startScript: string) {
  if (packageManager === 'npm') {
    return { install: 'npm install', start: `npm run ${startScript}` };
  }

  if (packageManager === 'yarn') {
    return { install: 'yarn', start: `yarn ${startScript}` };
  }

  if (packageManager === 'bun') {
    return { install: 'bun install', start: `bun run ${startScript}` };
  }

  return { install: 'pnpm install', start: `pnpm ${startScript}` };
}
