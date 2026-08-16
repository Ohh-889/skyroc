import CryptoJS from 'crypto-js';
import { describe, expect, it } from 'vitest';
import { AesCrypto } from '../src/crypto';

describe('AesCrypto', () => {
  const secret = 'test-secret-key';
  const crypto = new AesCrypto<{ age: number; name: string }>(secret);

  it('加密后应返回非空字符串', () => {
    const encrypted = crypto.encrypt({ name: 'Alice', age: 30 });
    expect(encrypted).toBeTruthy();
    expect(typeof encrypted).toBe('string');
  });

  it('加密后解密应还原原始数据', () => {
    const data = { name: 'Bob', age: 25 };
    const encrypted = crypto.encrypt(data);
    const decrypted = crypto.decrypt(encrypted);
    expect(decrypted).toEqual(data);
  });

  it('不同密钥应无法解密', () => {
    const data = { name: 'Charlie', age: 20 };
    const encrypted = crypto.encrypt(data);

    const wrongCrypto = new AesCrypto<{ age: number; name: string }>('wrong-key');
    const decrypted = wrongCrypto.decrypt(encrypted);
    expect(decrypted).toBeNull();
  });

  it('无效密文应返回 null', () => {
    const result = crypto.decrypt('invalid-encrypted-string');
    expect(result).toBeNull();
  });

  it('空字符串应返回 null', () => {
    const result = crypto.decrypt('');
    expect(result).toBeNull();
  });

  it('tryDecrypt 应区分解密失败与 JSON 解析失败', () => {
    const wrong = new AesCrypto<{ age: number; name: string }>('wrong-key');
    const encrypted = crypto.encrypt({ age: 20, name: 'Charlie' });

    expect(crypto.tryDecrypt(encrypted)).toEqual({ data: { age: 20, name: 'Charlie' }, ok: true });
    expect(wrong.tryDecrypt(encrypted)).toEqual({ ok: false, reason: 'decrypt' });
    expect(crypto.tryDecrypt('')).toEqual({ ok: false, reason: 'decrypt' });

    // 密钥正确但明文不是合法 JSON
    const plainBox = new AesCrypto<{ age: number; name: string }>(secret);
    const notJson = CryptoJS.AES.encrypt('not-json', secret).toString();

    expect(plainBox.tryDecrypt(notJson)).toEqual({ ok: false, reason: 'parse' });
  });
});
