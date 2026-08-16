import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import enquirer from 'enquirer';

import { locales } from '../locales';
import type { Lang } from '../locales';
import { execCommand } from '../shared';

interface PromptObject {
  description: string;
  scopes: string;
  types: string;
}

const { prompt } = enquirer;

/**
 * 构造 Conventional Commits 的校验正则。
 *
 * 必须锚定首尾并把 type 限定成白名单：不锚定的话任何含有 `xx: yy` 的句子都能蒙混过关，不限白名单的话
 * `banana: 修点东西` 也算合规——那这个校验就等于没有。
 */
export function createCommitMessageRegExp(types: string[]) {
  // 长的排前面，`feat-wip` 才不会被 `feat` 抢先匹配掉。
  const alternatives = types.toSorted((a, b) => b.length - a.length).join('|');

  return new RegExp(`^(?:${alternatives})(?:\\([^()]+\\))?!?: .+$`);
}

/**
 * Git commit with Conventional Commits standard
 *
 * @param lang
 */
export async function gitCommit(lang: Lang = 'en-us') {
  const { gitCommitMessages, gitCommitScopes, gitCommitTypes } = locales[lang];

  const typesChoices = gitCommitTypes.map(([value, msg]) => {
    const nameWithSuffix = `${value}:`;

    const message = `${nameWithSuffix.padEnd(12)}${msg}`;

    return {
      message,
      name: value
    };
  });

  const scopesChoices = gitCommitScopes.map(([value, msg]) => ({
    message: `${value.padEnd(30)} (${msg})`,
    name: value
  }));

  const result = await prompt<PromptObject>([
    {
      choices: typesChoices,
      message: gitCommitMessages.types,
      name: 'types',
      type: 'select'
    },
    {
      choices: scopesChoices,
      message: gitCommitMessages.scopes,
      name: 'scopes',
      type: 'select'
    },
    {
      message: gitCommitMessages.description,
      name: 'description',
      type: 'text'
    }
  ]);

  const breaking = result.description.startsWith('!') ? '!' : '';

  const description = result.description.replace(/^!/, '').trim();

  if (!description) {
    throw new Error(gitCommitMessages.emptyDescription);
  }

  const commitMsg = `${result.types}(${result.scopes})${breaking}: ${description}`;

  await execCommand('git', ['commit', '-m', commitMsg], { stdio: 'inherit' });
}

/**
 * 读取本次提交的信息文件。
 *
 * 走 `git rev-parse --git-path` 而不是手工拼 `<toplevel>/.git/COMMIT_EDITMSG`：在 worktree 里 `.git` 是文件不是目录，
 * 手工拼出来的路径根本不存在。
 */
async function readCommitMessage() {
  const gitMsgPath = await execCommand('git', ['rev-parse', '--git-path', 'COMMIT_EDITMSG']);

  return readFileSync(path.resolve(process.cwd(), gitMsgPath), 'utf8').trim();
}

/** Git commit message verify */
export async function gitCommitVerify(lang: Lang = 'en-us', ignores: RegExp[] = []) {
  const commitMsg = await readCommitMessage();

  if (ignores.some(regExp => regExp.test(commitMsg))) return;

  const { gitCommitTypes, gitCommitVerify: errorMsg } = locales[lang];
  const [subject = ''] = commitMsg.split('\n');
  const regExp = createCommitMessageRegExp(gitCommitTypes.map(([value]) => value));

  if (!regExp.test(subject)) {
    throw new Error(errorMsg);
  }
}
