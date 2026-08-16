import { describe, expect, it } from 'vitest';

import { createCommitMessageRegExp } from '../src/commands/git-commit';
import { locales } from '../src/locales';

const TYPES = locales['en-us'].gitCommitTypes.map(([value]) => value);

describe('createCommitMessageRegExp', () => {
  const regExp = createCommitMessageRegExp(TYPES);

  it.each([
    'feat(components): add Button',
    'fix(deps): bump antd',
    'feat(api)!: remove deprecated endpoints',
    'feat-wip(hooks): partial useAuth',
    'chore: tidy up'
  ])('accepts %s', message => {
    expect(regExp.test(message)).toBe(true);
  });

  it.each([
    ['unanchored prefix', 'random words feat(x): y'],
    ['unanchored suffix', 'feat(x): y trailing\nmore'],
    ['unknown type', 'banana(x): y'],
    ['uppercase type', 'FEAT(x): y'],
    ['missing space', 'feat(x):y'],
    ['empty description', 'feat(x): '],
    ['scope with nested parens', 'feat((x)): y']
  ])('rejects %s', (_label, message) => {
    expect(regExp.test(message)).toBe(false);
  });

  it('does not let a short type shadow a longer one', () => {
    // `feat` 排在 `feat-wip` 前面时，若不按长度排序就会先匹配 `feat` 然后在 `-wip` 处失败。
    expect(createCommitMessageRegExp(['feat', 'feat-wip']).test('feat-wip(hooks): x')).toBe(true);
  });
});
