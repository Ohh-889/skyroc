import CryptoJS from 'crypto-js';

/**
 * AES 对称加解密（基于 crypto-js 的 passphrase 模式）。
 *
 * ⚠️ 安全边界说明：passphrase 模式走的是 OpenSSL `EVP_BytesToKey`（MD5 单轮派生）， 密钥强度取决于口令本身，**不适合**作为真正的安全边界（如保护服务端机密）。 它的合理用途是本地存储混淆
 * —— 让 localStorage / 缓存里的内容不可直接肉眼读取。 需要真实加密强度时请改用 Web Crypto (`crypto.subtle`) 或服务端加密。
 *
 * @example
 *   ```ts
 *   const box = new AesCrypto<{ token: string }>(import.meta.env.VITE_STORAGE_SECRET);
 *   const cipher = box.encrypt({ token: 'abc' });
 *   box.decrypt(cipher); // { token: 'abc' }
 *   ```;
 */
export class AesCrypto<T extends object> {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  encrypt(data: T): string {
    const dataString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(dataString, this.secret);
    return encrypted.toString();
  }

  /**
   * 解密。失败返回 `null`。
   *
   * 需要区分失败原因（密钥错 / 密文损坏 / 明文本身就不是合法 JSON）时用 {@link tryDecrypt}。
   */
  decrypt(encrypted: string): T | null {
    const result = this.tryDecrypt(encrypted);

    return result.ok ? result.data : null;
  }

  /** 解密并返回结构化结果，便于调用方区分失败原因 */
  tryDecrypt(encrypted: string): { data: T; ok: true } | { ok: false; reason: 'decrypt' | 'parse' } {
    let dataString: string;

    try {
      dataString = CryptoJS.AES.decrypt(encrypted, this.secret).toString(CryptoJS.enc.Utf8);
    } catch {
      return { ok: false, reason: 'decrypt' };
    }

    // 密钥不匹配时 crypto-js 不抛错，只会解出空串或乱码
    if (!dataString) return { ok: false, reason: 'decrypt' };

    try {
      return { data: JSON.parse(dataString) as T, ok: true };
    } catch {
      return { ok: false, reason: 'parse' };
    }
  }
}
