import process from 'node:process';

import boxen from 'boxen';
import gradientString from 'gradient-string';
import type { Plugin } from 'vite';

const PROJECT_MESSAGE = '您好! 欢迎使用 Skyroc Electron 桌面应用';

export function setupProjectInfoPlugin(): Plugin {
  return {
    applyToEnvironment(environment) {
      return environment.name === 'client';
    },
    buildStart() {
      const message = gradientString('#646cff', 'magenta').multiline(PROJECT_MESSAGE);

      process.stdout.write(
        `${boxen(message, {
          borderColor: '#646cff',
          borderStyle: 'round',
          padding: 0.5
        })}\n`
      );
    },
    name: 'skyroc:electron-project-info'
  };
}
