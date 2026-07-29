/** 接口传输加密的配置，和后端的 `API_CRYPTO_*` 是同一份契约 */
export interface ApiCryptoOptions {
  /** 密钥头的名字，改要前后端一起改 */
  header: string;
  /** 加密请求体用的 RSA 公钥（PEM），后端持有配对的私钥 */
  publicKey: string;
}
