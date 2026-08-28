import type { InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';
import { beforeAll, describe, expect, it } from 'vitest';
import { importPublicKey, seal } from '../src/crypto/envelope';
import { createRequestSealer } from '../src/crypto/seal-request';

const HEADER = 'X-Encrypt-Key';
const NONCE_BYTES = 12;

let publicKeyPem: string;
let privateKey: CryptoKey;

/** 用测试里现生成的密钥对验证报文格式，不依赖任何写死的密钥 */
beforeAll(async () => {
  const pair = await crypto.subtle.generateKey(
    { hash: 'SHA-256', modulusLength: 2048, name: 'RSA-OAEP', publicExponent: new Uint8Array([1, 0, 1]) },
    true,
    ['encrypt', 'decrypt']
  );

  publicKeyPem = toPem(await crypto.subtle.exportKey('spki', pair.publicKey));
  privateKey = pair.privateKey;
});

function toPem(spki: ArrayBuffer): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(spki)));

  // 和环境变量里的写法保持一致：单行，换行是字面量 \n
  return `-----BEGIN PUBLIC KEY-----\\n${base64}\\n-----END PUBLIC KEY-----`;
}

function fromBase64(base64: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(base64), char => char.charCodeAt(0));
}

/**
 * 后端 unseal 的等价实现，用来验证前端发出去的密文确实解得开。
 *
 * 刻意用 WebCrypto 而不是 node-forge 解：加解密两头是两套独立实现， forge 这边算错了参数（OAEP 的 hash、GCM 的 tag 位置）这里就会失败。
 */
async function unseal(sealedKey: string, body: string): Promise<string> {
  const rawKey = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, fromBase64(sealedKey));
  const aesKey = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['decrypt']);

  const raw = fromBase64(body);
  const plaintext = await crypto.subtle.decrypt(
    { iv: raw.subarray(0, NONCE_BYTES), name: 'AES-GCM' },
    aesKey,
    raw.subarray(NONCE_BYTES)
  );

  return new TextDecoder().decode(plaintext);
}

function createConfig(overrides: Partial<InternalAxiosRequestConfig> = {}): InternalAxiosRequestConfig {
  return {
    headers: new AxiosHeaders(),
    method: 'post',
    url: '/auth/login',
    ...overrides
  } as InternalAxiosRequestConfig;
}

describe('seal', () => {
  it('produces a payload the holder of the private key can decrypt', async () => {
    const { body, sealedKey } = seal('{"userName":"admin"}', importPublicKey(publicKeyPem));

    expect(await unseal(sealedKey, body)).toBe('{"userName":"admin"}');
  });

  it('round-trips non-ascii bodies', async () => {
    const { body, sealedKey } = seal('{"nickName":"超级管理员"}', importPublicKey(publicKeyPem));

    expect(await unseal(sealedKey, body)).toBe('{"nickName":"超级管理员"}');
  });
});

describe('createRequestSealer', () => {
  it('leaves requests without the encrypt flag untouched', async () => {
    const sealRequest = createRequestSealer({ header: HEADER, publicKey: publicKeyPem });
    const config = createConfig({ data: { userName: 'admin' } });

    const sealed = await sealRequest(config);

    expect(sealed.data).toEqual({ userName: 'admin' });
    expect(sealed.headers.get(HEADER)).toBeUndefined();
  });

  it('replaces the body with ciphertext and puts the key in the header', async () => {
    const sealRequest = createRequestSealer({ header: HEADER, publicKey: publicKeyPem });
    const config = createConfig({ data: { password: 'admin123' }, encrypt: true });

    const sealed = await sealRequest(config);

    expect(sealed.headers.get('Content-Type')).toBe('text/plain');
    expect(await unseal(sealed.headers.get(HEADER) as string, sealed.data)).toBe('{"password":"admin123"}');
  });

  it('encrypts the same body differently every time', async () => {
    const sealRequest = createRequestSealer({ header: HEADER, publicKey: publicKeyPem });

    const first = await sealRequest(createConfig({ data: { password: 'admin123' }, encrypt: true }));
    const second = await sealRequest(createConfig({ data: { password: 'admin123' }, encrypt: true }));

    expect(first.data).not.toBe(second.data);
  });

  it('fails loudly instead of sending plaintext when no public key is configured', async () => {
    const sealRequest = createRequestSealer();

    await expect(sealRequest(createConfig({ data: { password: 'admin123' }, encrypt: true }))).rejects.toThrow(
      'crypto.publicKey'
    );
  });

  it('rejects request bodies it cannot serialize to JSON', async () => {
    const sealRequest = createRequestSealer({ header: HEADER, publicKey: publicKeyPem });

    await expect(sealRequest(createConfig({ data: new FormData(), encrypt: true }))).rejects.toThrow(TypeError);
  });
});
