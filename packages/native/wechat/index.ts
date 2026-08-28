import type { EventSubscription } from 'expo-modules-core';

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
  WechatRequestSentEvent,
  WechatRespKind,
  WechatResult,
  WechatShareResponse,
  WechatUniversalLinkCheckResult
} from './src/Wechat.types';
import WechatModule from './src/WechatModule';

export type * from './src/Wechat.types';

/** 本机是否装了微信 */
export function isWechatInstalled(): Promise<boolean> {
  return WechatModule.isWechatInstalledAsync();
}

/** 直接打开微信客户端 */
export function openWechat(): Promise<boolean> {
  return WechatModule.openWechatAsync();
}

/** 当前微信 SDK 的版本号，报障给微信技术支持时带上 */
export function getWechatApiVersion(): Promise<string> {
  return WechatModule.getApiVersionAsync();
}

/** 微信在 App Store 的安装地址，由 SDK 给出。 引导「去安装微信」时用它，别自己写死链接。 */
export function getWechatInstallUrl(): Promise<string> {
  return WechatModule.getInstallUrlAsync();
}

/**
 * Universal Link 自检，**仅调试用**（微信头文件原话：「请勿在正式环境的调用」）。
 *
 * 会依次检查参数、系统版本、微信版本、SDK 内部操作、拉起微信、从微信返回六步， 中间**会真的切到微信再跳回来**，所以只能在真机上跑。 失败时 `steps` 的最后一条就是卡住的地方，`suggestion`
 * 是微信给的修正建议。
 *
 * 排查 `ERR_WECHAT_NO_RESPONSE` 的第一步就该跑这个。
 */
export function checkWechatUniversalLink(): Promise<WechatUniversalLinkCheckResult> {
  return WechatModule.checkUniversalLinkAsync();
}

/**
 * 调整模块的全局行为，返回实际生效的配置。
 *
 * `resumeGraceMs`：从微信切回本 App 后，再等多久还没收到回调就判定这次请求没有结果 （返回 `ERR_WECHAT_NO_RESPONSE` 并释放槽位）。默认 **500ms**，会被钳制到 [100,
 * 5000]。
 *
 * 需要调大的情况：Universal Link 走了较慢的跳转链路，实测回调经常晚于 500ms 到达， 此时默认值会把正常结果误判成「没有结果」。 需要调小的情况：确认回调很快，希望用户放弃操作后更快拿到结果。
 *
 * 这是环境属性而不是单次请求的属性（回调延迟跟你分享什么没关系）， 所以做成全局配置，而不是给九个 `share*` 各加一个参数。 一般在 App 启动时调一次即可。
 */
export function configureWechat(options: { resumeGraceMs: number }): Promise<number> {
  return WechatModule.setResumeGraceMsAsync(options.resumeGraceMs);
}

/** 每次调用都可以挂的第一段回调 */
export type WechatLaunchOptions = {
  /**
   * 请求已送达微信、App 即将切走时触发一次。
   *
   * 在此之前是**本地准备**（下载媒体、压缩缩略图），可能几百毫秒到几秒； 在此之后是**用户在微信里操作**，时长完全不可控。 典型用法是切换 loading 文案：`准备中…` → `等待微信…`
   *
   * @param ok 微信是否受理了这次唤起。false 时紧接着就会拿到失败结果
   */
  onLaunched?: (ok: boolean) => void;
};

/**
 * 把「第一段事件」接到这次调用上。
 *
 * 同一种 kind 同时只允许一个在途请求（原生侧用 pending 槽保证）， 所以这里按 kind 过滤就足够对上号，不需要额外的请求 id。
 */
function withLaunchHook<T>(
  kind: WechatRespKind,
  onLaunched: WechatLaunchOptions['onLaunched'],
  call: () => Promise<T>
): Promise<T> {
  if (!onLaunched) {
    return call();
  }

  let subscription: EventSubscription | null = null;
  subscription = WechatModule.addListener('onRequestSent', (event: WechatRequestSentEvent) => {
    if (event.kind !== kind) return;
    subscription?.remove();
    subscription = null;
    onLaunched(event.ok);
  });

  return call().finally(() => {
    subscription?.remove();
    subscription = null;
  });
}

// ---------------------------------------------------------------- 登录

/**
 * 拉起微信授权登录。
 *
 * **永远不会 reject**：成功是 `{ ok: true, payload }`（`payload.code` 拿去给后端换 `access_token` / `openid`，换取 token 要用
 * AppSecret，绝不能放在客户端）； 用户取消 / 拒绝、没装微信、插件没配都是 `{ ok: false, code }`，见 `WechatResultCode`。
 */
export function sendWechatAuth(
  options?: WechatLaunchOptions & {
    scope?: WechatAuthScope;
    /** 建议每次登录传一个随机值，回调里比对，避免串号 */
    state?: string;
  }
): Promise<WechatResult<WechatAuthResponse>> {
  return withLaunchHook('auth', options?.onLaunched, () =>
    WechatModule.sendAuthAsync(options?.scope ?? 'snsapi_userinfo', options?.state ?? null)
  );
}

/**
 * 取走冷启动期间到达的授权结果，没有则返回 `null`。
 *
 * App 被系统杀掉后从微信返回时，原生先于 JS 拿到结果，此时没有挂起的 Promise， 结果（含用户取消这种失败）会被缓存在原生侧，需要 JS 起来后主动取一次。
 */
export function consumePendingWechatAuth(): Promise<WechatResult<WechatAuthResponse> | null> {
  return WechatModule.consumePendingAuthResponseAsync();
}

// ---------------------------------------------------------------- 分享与收藏
//
// 九种类型对应微信的九个媒体对象。除文本外都支持 title / description / thumb，
// 缩略图超过 32KB 时原生会自动缩尺寸 + 压 JPEG，不用自己处理。
// 和登录一样，全部 resolve 成 WechatResult，永远不 reject。

/** 纯文本 */
export function shareText(options: ShareTextOptions & WechatLaunchOptions): Promise<WechatResult<WechatShareResponse>> {
  const { onLaunched, ...rest } = options;
  return withLaunchHook('share', onLaunched, () => WechatModule.shareTextAsync(rest));
}

/** 图片 */
export function shareImage(
  options: ShareImageOptions & WechatLaunchOptions
): Promise<WechatResult<WechatShareResponse>> {
  const { onLaunched, ...rest } = options;
  return withLaunchHook('share', onLaunched, () => WechatModule.shareImageAsync(rest));
}

/** 网页链接 */
export function shareWebpage(
  options: ShareWebpageOptions & WechatLaunchOptions
): Promise<WechatResult<WechatShareResponse>> {
  const { onLaunched, ...rest } = options;
  return withLaunchHook('share', onLaunched, () => WechatModule.shareWebpageAsync(rest));
}

/** 视频链接 */
export function shareVideo(
  options: ShareVideoOptions & WechatLaunchOptions
): Promise<WechatResult<WechatShareResponse>> {
  const { onLaunched, ...rest } = options;
  return withLaunchHook('share', onLaunched, () => WechatModule.shareVideoAsync(rest));
}

/** 音乐 */
export function shareMusic(
  options: ShareMusicOptions & WechatLaunchOptions
): Promise<WechatResult<WechatShareResponse>> {
  const { onLaunched, ...rest } = options;
  return withLaunchHook('share', onLaunched, () => WechatModule.shareMusicAsync(rest));
}

/** 音乐视频（带歌手、歌词、专辑封面的富卡片） */
export function shareMusicVideo(
  options: ShareMusicVideoOptions & WechatLaunchOptions
): Promise<WechatResult<WechatShareResponse>> {
  const { onLaunched, ...rest } = options;
  return withLaunchHook('share', onLaunched, () => WechatModule.shareMusicVideoAsync(rest));
}

/** 文件（PDF 等） */
export function shareFile(options: ShareFileOptions & WechatLaunchOptions): Promise<WechatResult<WechatShareResponse>> {
  const { onLaunched, ...rest } = options;
  return withLaunchHook('share', onLaunched, () => WechatModule.shareFileAsync(rest));
}

/** 表情（gif / png） */
export function shareEmoticon(
  options: ShareEmoticonOptions & WechatLaunchOptions
): Promise<WechatResult<WechatShareResponse>> {
  const { onLaunched, ...rest } = options;
  return withLaunchHook('share', onLaunched, () => WechatModule.shareEmoticonAsync(rest));
}

/** 小程序卡片。只能发到会话，`scene` 会被忽略 */
export function shareMiniProgram(
  options: ShareMiniProgramOptions & WechatLaunchOptions
): Promise<WechatResult<WechatShareResponse>> {
  const { onLaunched, ...rest } = options;
  return withLaunchHook('share', onLaunched, () => WechatModule.shareMiniProgramAsync(rest));
}

/** 取走冷启动期间到达的分享结果，语义同 `consumePendingWechatAuth` */
export function consumePendingWechatShare(): Promise<WechatResult<WechatShareResponse> | null> {
  return WechatModule.consumePendingShareResponseAsync();
}

// ---------------------------------------------------------------- 事件

/** 监听所有「已唤起微信」事件（第一段），跨调用的全局观察用 */
export function addWechatRequestSentListener(listener: (event: WechatRequestSentEvent) => void): EventSubscription {
  return WechatModule.addListener('onRequestSent', listener);
}

/**
 * 监听所有微信响应（第二段）。
 *
 * 注意这是全量通道，正常流程对应方法的 Promise 已经能拿到结果， 两者会同时触发，别重复处理。
 */
export function addWechatResponseListener(listener: (result: WechatResult) => void): EventSubscription {
  return WechatModule.addListener('onResponse', listener);
}

/**
 * 用户没有完成这次操作——UI 上应该静默处理，不要弹错误提示。
 *
 * 覆盖两种 code：`ERR_WECHAT_USER_CANCELLED`（在微信里明确点了取消） 和 `ERR_WECHAT_NO_RESPONSE`（切回来后没等到回调，多半是按 Home 放弃了）。
 * 两者对用户是一回事，但排查问题时要看原始 `result.code` 区分—— `ERR_WECHAT_NO_RESPONSE` 大量出现通常意味着 Universal Link 配置有问题。
 */
export function isWechatCancelled(result: WechatResult): boolean {
  return !result.ok && (result.code === 'ERR_WECHAT_USER_CANCELLED' || result.code === 'ERR_WECHAT_NO_RESPONSE');
}
