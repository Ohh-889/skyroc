/**
 * 接口传输加密的信封：RSA 包住一次性 AES 密钥，AES-GCM 包住 body。
 *
 * 分两层是因为非对称算法有明文长度上限而且慢，只能拿来传密钥；body 的大小不设上限， 必须走对称算法。
 *
 * 报文格式和后端 `app/core/crypto/envelope.py` 是同一份契约：
 *
 *     密钥头  base64( RSA-OAEP-SHA256(服务端公钥, aesKey) )
 *     body    base64( nonce(12B) ‖ AES-256-GCM(aesKey, 明文) ‖ tag(16B) )
 *
 * 走 node-forge 而不是 WebCrypto，是因为 `crypto.subtle` 只在安全上下文里存在： 用 http + 局域网 IP 访问开发服务器时整条加密链路直接不可用，手机和同事的电脑都进不来。 forge 是纯
 * JS 实现，不挑上下文，代价是约 90KB gzip 和慢一些的 RSA（一次登录几十毫秒）。
 *
 * 这个模块只做加密：不认识 axios、不读环境变量，公钥由调用方传进来。
 */

import forge from 'node-forge';

/** AES-256 */
const AES_KEY_BYTES = 32;

/** GCM 的标准 nonce 长度，换成别的会走 GHASH 的慢路径 */
const NONCE_BYTES = 12;

/** GCM 认证标签长度，和后端 `AESGCM` 的默认值一致 */
const TAG_BITS = 128;

const PEM_MARKER = /-----(?:BEGIN|END)[^-]+-----/g;

/** 导入后的服务端公钥，握着它就能加密，不必每个请求重新解一遍 PEM */
export type ApiPublicKey = forge.pki.rsa.PublicKey;

export interface SealedPayload {
  /** 放进 body 的密文 */
  body: string;
  /** 放进密钥头的密文密钥 */
  sealedKey: string;
}

/**
 * 载入加密请求用的 RSA 公钥，后端持有配对的私钥。
 *
 * 传进来的 PEM 可以是多行的原文，也可以是环境变量里换行写成字面量 `\n` 的单行形式。
 */
export function importPublicKey(pem: string): ApiPublicKey {
  return forge.pki.publicKeyFromPem(normalizePem(pem));
}

/**
 * 加密，返回放进密钥头和放进 body 的两段密文。
 *
 * 每次都生成新的 AES 密钥和 nonce，所以同一份明文两次加密的结果不同。
 */
export function seal(plaintext: string, publicKey: ApiPublicKey): SealedPayload {
  // forge 通篇用 binary string 表示字节序列，下面这些变量都是这个编码，不是可读文本
  const aesKey = forge.random.getBytesSync(AES_KEY_BYTES);
  const nonce = forge.random.getBytesSync(NONCE_BYTES);

  const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
  cipher.start({ iv: nonce, tagLength: TAG_BITS });
  cipher.update(forge.util.createBuffer(plaintext, 'utf8'));
  cipher.finish();

  // WebCrypto 和后端都把 tag 接在密文尾巴上当一整段，forge 把它单独放在 mode.tag 里，得手动拼回去
  const body = nonce + cipher.output.getBytes() + cipher.mode.tag.getBytes();

  const sealedKey = publicKey.encrypt(aesKey, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    // 不写死的话 forge 会拿 md 的默认值去做 MGF1，和后端的 SHA-256 对不上
    mgf1: { md: forge.md.sha256.create() }
  });

  return {
    body: forge.util.encode64(body),
    sealedKey: forge.util.encode64(sealedKey)
  };
}

/**
 * 把各种写法的公钥统一成 forge 解析器认的规范 PEM。
 *
 * PEM 是多行的，装进环境变量只能把换行写成字面量 `\n`，剥掉首尾标记和所有空白之后剩下的才是 base64。
 */
function normalizePem(pem: string): string {
  const base64 = pem.replace(PEM_MARKER, '').replace(/\\n/g, '').replace(/\s/g, '');

  return `-----BEGIN PUBLIC KEY-----\n${base64}\n-----END PUBLIC KEY-----`;
}
