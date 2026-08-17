import { describe, expect, it } from 'vitest';
import {
  REG_CODE_FOUR,
  REG_CODE_SIX,
  REG_EMAIL,
  REG_PHONE,
  REG_PWD,
  REG_PWD_STRONG,
  REG_URL,
  REG_USER_NAME
} from '../src/reg';

// ==================== REG_USER_NAME ====================

describe('REG_USER_NAME', () => {
  it('4-16 位中英文数字下划线应匹配', () => {
    expect(REG_USER_NAME.test('test')).toBe(true);
    expect(REG_USER_NAME.test('用户名_01')).toBe(true);
    expect(REG_USER_NAME.test('user-name')).toBe(true);
  });

  it('少于 4 位应不匹配', () => {
    expect(REG_USER_NAME.test('abc')).toBe(false);
  });

  it('超过 16 位应不匹配', () => {
    expect(REG_USER_NAME.test('a'.repeat(17))).toBe(false);
  });

  it('包含特殊字符应不匹配', () => {
    expect(REG_USER_NAME.test('user@name')).toBe(false);
  });
});

// ==================== REG_PHONE ====================

describe('REG_PHONE', () => {
  it('有效手机号应匹配', () => {
    expect(REG_PHONE.test('13800138000')).toBe(true);
    expect(REG_PHONE.test('15912345678')).toBe(true);
    expect(REG_PHONE.test('18688886666')).toBe(true);
  });

  it('无效手机号应不匹配', () => {
    expect(REG_PHONE.test('12345678901')).toBe(false);
    expect(REG_PHONE.test('10800138000')).toBe(false);
    expect(REG_PHONE.test('1380013800')).toBe(false);
    expect(REG_PHONE.test('138001380001')).toBe(false);
  });
});

// ==================== REG_PWD ====================

describe('REG_PWD', () => {
  it('6-18 位字母数字下划线应匹配', () => {
    expect(REG_PWD.test('abc123')).toBe(true);
    expect(REG_PWD.test('password_01')).toBe(true);
  });

  it('少于 6 位应不匹配', () => {
    expect(REG_PWD.test('abc12')).toBe(false);
  });

  it('超过 18 位应不匹配', () => {
    expect(REG_PWD.test('a'.repeat(19))).toBe(false);
  });
});

// ==================== REG_EMAIL ====================

describe('REG_EMAIL', () => {
  it('有效邮箱应匹配', () => {
    expect(REG_EMAIL.test('test@example.com')).toBe(true);
    expect(REG_EMAIL.test('user.name@domain.co')).toBe(true);
  });

  it('无效邮箱应不匹配', () => {
    expect(REG_EMAIL.test('invalid')).toBe(false);
    expect(REG_EMAIL.test('@domain.com')).toBe(false);
  });
});

// ==================== REG_CODE ====================

describe('REG_CODE_SIX', () => {
  it('6 位数字应匹配', () => {
    expect(REG_CODE_SIX.test('123456')).toBe(true);
  });

  it('非 6 位应不匹配', () => {
    expect(REG_CODE_SIX.test('12345')).toBe(false);
    expect(REG_CODE_SIX.test('1234567')).toBe(false);
  });

  it('含字母应不匹配', () => {
    expect(REG_CODE_SIX.test('12345a')).toBe(false);
  });
});

describe('REG_CODE_FOUR', () => {
  it('4 位数字应匹配', () => {
    expect(REG_CODE_FOUR.test('1234')).toBe(true);
  });

  it('非 4 位应不匹配', () => {
    expect(REG_CODE_FOUR.test('123')).toBe(false);
    expect(REG_CODE_FOUR.test('12345')).toBe(false);
  });
});

// ==================== REG_URL ====================

describe('REG_URL', () => {
  it('HTTP URL 应匹配', () => {
    expect(REG_URL.test('http://example.com')).toBe(true);
    expect(REG_URL.test('https://example.com/path')).toBe(true);
  });

  it('带查询参数应匹配', () => {
    expect(REG_URL.test('https://example.com/path?q=1&b=2')).toBe(true);
  });

  it('端口、协议相对、hash 应匹配', () => {
    expect(REG_URL.test('https://example.com:8080/a/b')).toBe(true);
    expect(REG_URL.test('//cdn.example.com/a.js')).toBe(true);
    expect(REG_URL.test('example.com/docs#anchor')).toBe(true);
  });

  it('空字符串与非法输入应不匹配', () => {
    expect(REG_URL.test('')).toBe(false);
    expect(REG_URL.test('not a url')).toBe(false);
    expect(REG_URL.test('http://')).toBe(false);
  });

  it('长串失配时应在常数级时间内返回（无灾难性回溯）', () => {
    const evil = `http://${'a'.repeat(60)}!`;
    const start = performance.now();

    expect(REG_URL.test(evil)).toBe(false);
    expect(performance.now() - start).toBeLessThan(100);
  });
});

// ==================== REG_PWD_STRONG ====================

describe('REG_PWD_STRONG', () => {
  it('同时含大小写与数字的 8-32 位应匹配，允许符号', () => {
    expect(REG_PWD_STRONG.test('Abcdef12')).toBe(true);
    expect(REG_PWD_STRONG.test('Abcdef12!@#')).toBe(true);
  });

  it('缺少任一类别或长度不足应不匹配', () => {
    expect(REG_PWD_STRONG.test('abcdef12')).toBe(false);
    expect(REG_PWD_STRONG.test('ABCDEF12')).toBe(false);
    expect(REG_PWD_STRONG.test('Abcdefgh')).toBe(false);
    expect(REG_PWD_STRONG.test('Abcde1')).toBe(false);
    expect(REG_PWD_STRONG.test(`A1${'a'.repeat(31)}`)).toBe(false);
  });
});
