/**
 * 接口传输加密的信封：RSA 包住一次性 AES 密钥，AES-GCM 包住 body。
 *
 * 分两层是因为非对称算法有明文长度上限而且慢，只能拿来传密钥；body 的大小不设上限，
 * 必须走对称算法。
 *
 * 报文格式和后端 `app/core/crypto/envelope.py` 是同一份契约：
 *
 *     密钥头  base64( RSA-OAEP-SHA256(服务端公钥, aesKey) )
 *     body    base64( nonce(12B) ‖ AES-256-GCM(aesKey, 明文) )
 *
 * 这个模块只做加密：不认识 axios、不读环境变量，公钥由调用方传进来。
 */

const RSA_ALGORITHM: RsaHashedImportParams = { hash: 'SHA-256', name: 'RSA-OAEP' };

/** AES-256 */
const AES_KEY_BYTES = 32;

/** GCM 的标准 nonce 长度，换成别的会走 GHASH 的慢路径 */
const NONCE_BYTES = 12;

const PEM_MARKER = /-----(?:BEGIN|END)[^-]+-----/g;

/** 一次 spread 进 String.fromCharCode 的字节数，再多会爆调用栈 */
const BASE64_CHUNK = 0x80_00;

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
export function importPublicKey(pem: string): Promise<CryptoKey> {
  return getSubtle().importKey('spki', pemToDer(pem), RSA_ALGORITHM, false, ['encrypt']);
}

/**
 * 加密，返回放进密钥头和放进 body 的两段密文。
 *
 * 每次都生成新的 AES 密钥和 nonce，所以同一份明文两次加密的结果不同。
 */
export async function seal(plaintext: string, publicKey: CryptoKey): Promise<SealedPayload> {
  const subtle = getSubtle();

  const aesKey = globalThis.crypto.getRandomValues(new Uint8Array(AES_KEY_BYTES));
  const nonce = globalThis.crypto.getRandomValues(new Uint8Array(NONCE_BYTES));

  const key = await subtle.importKey('raw', aesKey, 'AES-GCM', false, ['encrypt']);
  const ciphertext = await subtle.encrypt({ iv: nonce, name: 'AES-GCM' }, key, new TextEncoder().encode(plaintext));
  const sealedKey = await subtle.encrypt(RSA_ALGORITHM, publicKey, aesKey);

  return {
    body: toBase64(concat(nonce, new Uint8Array(ciphertext))),
    sealedKey: toBase64(new Uint8Array(sealedKey))
  };
}

function getSubtle(): SubtleCrypto {
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    throw new Error(
      'WebCrypto 不可用：crypto.subtle 只在安全上下文里存在。用 http + 局域网 IP 访问开发服务器时拿不到它，改用 localhost 或 https'
    );
  }

  return subtle;
}

// 泛型参数不能省：裸 Uint8Array 是 Uint8Array<ArrayBufferLike>，WebCrypto 只收 ArrayBuffer 那一支
function pemToDer(pem: string): Uint8Array<ArrayBuffer> {
  // PEM 是多行的，装进环境变量只能把换行写成字面量 \n，去掉之后剩下的才是 base64
  const base64 = pem.replace(PEM_MARKER, '').replace(/\\n/g, '').replace(/\s/g, '');

  return fromBase64(base64);
}

function concat(head: Uint8Array, tail: Uint8Array): Uint8Array<ArrayBuffer> {
  const merged = new Uint8Array(head.length + tail.length);
  merged.set(head);
  merged.set(tail, head.length);

  return merged;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';

  for (let i = 0; i < bytes.length; i += BASE64_CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + BASE64_CHUNK));
  }

  return btoa(binary);
}

function fromBase64(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}
