/**
 * 拦截层：把 `encrypt: true` 的请求体换成密文，密钥放进约定的请求头。
 *
 * 只有声明了标记的接口参与，其余接口不进这段逻辑。声明写在调用处（`request({ encrypt: true })`），
 * 而不是按 url 匹配一张名单——名单和接口分处两地，加接口的人不会想起来去改它。
 */

import type { InternalAxiosRequestConfig } from 'axios';

import { importPublicKey, seal } from './envelope';
import type { ApiCryptoOptions } from './types';

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * 是否加密请求体
     *
     * 对应后端接口上的 `@api_encrypt()`，两边必须同时开或同时关。
     */
    encrypt?: boolean;
  }
}

/**
 * 造一个请求体加密器，没配公钥也照样能造。
 *
 * 缺公钥不在这里报错，是为了让没有加密需求的部署不用先生成一对 RSA 密钥；
 * 真正标了 `encrypt: true` 的请求会在发出前抛错，不会退化成明文发出去。
 */
export function createRequestSealer(options?: ApiCryptoOptions) {
  // 公钥导入一次就够，之后每个请求复用同一个 CryptoKey
  let publicKey: Promise<CryptoKey> | null = null;

  return async function sealRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    if (!config.encrypt) {
      return config;
    }

    if (!options?.publicKey) {
      throw new Error(`${config.url} 声明了 encrypt: true，但请求实例没有配置 crypto.publicKey`);
    }

    publicKey ??= importPublicKey(options.publicKey);

    const { body, sealedKey } = await seal(toPlaintext(config.data), await publicKey);

    config.data = body;
    config.headers.set(options.header, sealedKey);
    // body 现在是一段 base64，声明成 application/json 会让网关和 WAF 按 JSON 去解析它
    config.headers.setContentType('text/plain');

    return config;
  };
}

function toPlaintext(data: unknown): string {
  if (data === undefined || data === null) {
    return '{}';
  }

  if (typeof data === 'string') {
    return data;
  }

  if (data instanceof FormData || data instanceof Blob || data instanceof ArrayBuffer) {
    throw new TypeError('接口传输加密只支持 JSON 请求体，上传文件的接口去掉 encrypt: true');
  }

  return JSON.stringify(data);
}
