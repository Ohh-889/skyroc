import { execCommand } from '../shared';

export async function updatePkg(args: string[] = ['--deep', '-u']) {
  await execCommand('npx', ['npm-check-updates', ...args], { stdio: 'inherit' });
}
