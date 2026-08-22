import { NativeModule, requireNativeModule } from 'expo';

import type {
  ShareEmoticonOptions,
  ShareFileOptions,
  ShareImageOptions,
  ShareMiniProgramOptions,
  ShareMusicOptions,
  ShareMusicVideoOptions,
  ShareTextOptions,
  ShareVideoOptions,
  ShareWebpageOptions,
  WechatAuthResponse,
  WechatAuthScope,
  WechatModuleEvents,
  WechatResult,
  WechatShareResponse,
  WechatUniversalLinkCheckResult,
} from './Wechat.types';

/**
 * 原生模块的直接映射，是「原始契约」，不做任何默认值和易用性包装。
 * 业务代码请用 `index.ts` 导出的同名友好函数。
 *
 * 通用约定：
 * - 所有方法都在原生侧自行切主线程，调用方不用关心线程
 * - **除 isWechatInstalledAsync / openWechatAsync 外一律 resolve 成 `WechatResult`，永远不 reject**，
 *   用户取消、未装微信、参数非法都表现为 `{ ok: false, code }`，见 `WechatResultCode`
 */
declare class WechatModule extends NativeModule<WechatModuleEvents> {
  /**
   * 本机是否装了微信（`WXApi.isWXAppInstalled`）。
   * Android 11+ 需要 manifest 里的 `<queries>` 声明，插件已经写好。
   */
  isWechatInstalledAsync(): Promise<boolean>;

  /** 直接把微信切到前台（`WXApi.openWXApp`），不发任何请求。返回是否成功唤起 */
  openWechatAsync(): Promise<boolean>;

  /** 当前微信 SDK 的版本号（`WXApi.getApiVersion`），报障时提供给微信技术支持 */
  getApiVersionAsync(): Promise<string>;

  /** 微信在 App Store 的安装地址（`WXApi.getWXAppInstallUrl`），比自己写死链接可靠 */
  getInstallUrlAsync(): Promise<string>;

  /**
   * Universal Link 自检（`WXApi.checkUniversalLinkReady`）。
   *
   * **仅调试用**，头文件里明确写了「请勿在正式环境的调用」。
   * 会真的把微信拉起来再跳回本 App，所以只能在真机上跑。
   */
  checkUniversalLinkAsync(): Promise<WechatUniversalLinkCheckResult>;

  /**
   * 设置「从微信返回后等多久判定没有结果」，返回钳制到 [100, 5000] 之后实际生效的毫秒数。
   * @see configureWechat
   */
  setResumeGraceMsAsync(milliseconds: number): Promise<number>;

  // -------------------------------------------------------------- 登录

  /**
   * 拉起微信授权登录（`SendAuthReq`），App 会切到微信。
   *
   * @param scope 一般传 `snsapi_userinfo`
   * @param state 原样回传的防串号标记，不需要就传 `null`（原生会转成空串）
   * @returns 成功时带 `code`，需要交给自己的后端换 token
   */
  sendAuthAsync(scope: WechatAuthScope, state: string | null): Promise<WechatResult<WechatAuthResponse>>;

  /**
   * 取走冷启动期间到达的授权结果，取一次即清空，没有则返回 `null`。
   *
   * App 被系统杀掉后从微信返回时，原生先于 JS 拿到结果，那时没有挂起的 Promise，
   * 结果（含「用户取消」这种失败）会被缓存在原生侧等 JS 起来取。
   */
  consumePendingAuthResponseAsync(): Promise<WechatResult<WechatAuthResponse> | null>;

  // -------------------------------------------------------------- 分享与收藏
  //
  // 九个方法对应微信的九个媒体对象，都会 App 切到微信让用户确认。
  // 除 shareTextAsync 外都支持 title / description / thumb；
  // thumb 超过 32KB 时原生自动缩尺寸 + 压 JPEG，不用自己处理。
  //
  // 请求发出「之前」的失败（缺必填字段、媒体下载失败、超过微信字节上限）
  // 同样返回 `{ ok: false }`，code 为 `ERR_WECHAT_INVALID_OPTIONS` / `ERR_WECHAT_MEDIA_*`，
  // 且不会占住在途槽位，可以直接重试。

  /** 纯文本（`SendMessageToWXReq.bText`）。文本长度须 >0 且 <10K */
  shareTextAsync(options: ShareTextOptions): Promise<WechatResult<WechatShareResponse>>;

  /** 图片（`WXImageObject`）。原图 ≤10MB，来源支持 http(s) / file / 裸路径 / data URI */
  shareImageAsync(options: ShareImageOptions): Promise<WechatResult<WechatShareResponse>>;

  /** 网页链接卡片（`WXWebpageObject`），最常用的一种。`url` ≤10KB */
  shareWebpageAsync(options: ShareWebpageOptions): Promise<WechatResult<WechatShareResponse>>;

  /** 视频链接（`WXVideoObject`）。传的是播放地址而非视频文件，可另给低带宽地址 */
  shareVideoAsync(options: ShareVideoOptions): Promise<WechatResult<WechatShareResponse>>;

  /** 音乐（`WXMusicObject`）。`url` 是点开跳转的网页，`dataUrl` 是微信直接播放的音频地址 */
  shareMusicAsync(options: ShareMusicOptions): Promise<WechatResult<WechatShareResponse>>;

  /** 音乐视频（`WXMusicVideoObject`），带歌手、时长、歌词、高清专辑封面的富卡片 */
  shareMusicVideoAsync(options: ShareMusicVideoOptions): Promise<WechatResult<WechatShareResponse>>;

  /** 文件（`WXFileObject`），PDF 等。≤10MB；后缀名不传会从来源路径推断，推不出来则报错 */
  shareFileAsync(options: ShareFileOptions): Promise<WechatResult<WechatShareResponse>>;

  /** 表情（`WXEmoticonObject`），gif / png，≤10MB */
  shareEmoticonAsync(options: ShareEmoticonOptions): Promise<WechatResult<WechatShareResponse>>;

  /**
   * 小程序卡片（`WXMiniProgramObject`）。
   * 微信只允许发到会话，传的 `scene` 会被原生强制改成 `session`。
   */
  shareMiniProgramAsync(options: ShareMiniProgramOptions): Promise<WechatResult<WechatShareResponse>>;

  /** 取走冷启动期间到达的分享结果，语义同 `consumePendingAuthResponseAsync` */
  consumePendingShareResponseAsync(): Promise<WechatResult<WechatShareResponse> | null>;
}

export default requireNativeModule<WechatModule>('Wechat');
