/** 微信授权作用域，登录取用户信息用 `snsapi_userinfo` */
export type WechatAuthScope = 'snsapi_userinfo' | 'snsapi_base' | (string & {});

/**
 * 响应种类。
 *
 * 微信的原生回调只有一个口子，且响应里带不回请求 id，只能按响应子类型区分，
 * 所以每接一个新功能就在这里加一个成员（支付 → 'pay'）。
 */
export type WechatRespKind = 'auth' | 'share';

export type WechatAuthResponse = {
  /** 授权临时票据，拿去换 access_token */
  code: string | null;
  country: string | null;
  /** 微信原始错误码，成功时为 0 */
  errCode: number;
  errStr: string;
  lang: string | null;
  /** 发起时传入的 state，原样回传，用来防串号 */
  state: string | null;
};

export type WechatShareResponse = {
  country: string | null;
  errCode: number;
  errStr: string;
  lang: string | null;
};

export type WechatResponsePayload = WechatAuthResponse | WechatShareResponse;

/**
 * 失败原因。
 *
 * 前六个来自微信自己的 `WXErrCode`（见 SDK 头文件 `WXApiObject.h:17`），
 * 其余是本模块在请求发出之前就能判定的情况。
 */
export type WechatResultCode =
  /** 用户拒绝授权（微信 errCode -4） */
  | 'ERR_WECHAT_AUTH_DENIED'
  /** 微信返回的普通错误（-1） */
  | 'ERR_WECHAT_COMMON'
  /** 微信返回了未知错误码，`message` 里是原始 errStr */
  | 'ERR_WECHAT_FAILED'
  /** 参数不合法：缺必填字段，或超过微信的字节上限 */
  | 'ERR_WECHAT_INVALID_OPTIONS'
  /** 远程媒体下载失败 */
  | 'ERR_WECHAT_MEDIA_DOWNLOAD_FAILED'
  /** data: URI 解析失败 */
  | 'ERR_WECHAT_MEDIA_INVALID'
  /** 本地媒体文件读取失败 */
  | 'ERR_WECHAT_MEDIA_READ_FAILED'
  /** 媒体文件超过微信上限 */
  | 'ERR_WECHAT_MEDIA_TOO_LARGE'
  /**
   * 从微信返回后，在宽限期内没等到任何回调。
   *
   * 多半是用户按 Home / 划掉微信放弃了操作，UI 上和取消一样静默处理即可。
   * 但如果线上大量出现，要去查 Universal Link 配置——回调丢失也会走到这里。
   * 宽限期用 `configureWechat({ resumeGraceMs })` 调整。
   */
  | 'ERR_WECHAT_NO_RESPONSE'
  /** app.config.ts 里的 wechat 插件没配 AppID / UniversalLink */
  | 'ERR_WECHAT_NOT_CONFIGURED'
  /** 没装微信客户端 */
  | 'ERR_WECHAT_NOT_INSTALLED'
  /** 同类型的上一个请求还没结束就又发起了一个 */
  | 'ERR_WECHAT_PENDING'
  /** 请求根本没送达微信 */
  | 'ERR_WECHAT_REQUEST_NOT_SENT'
  /** 微信侧发送失败（-3） */
  | 'ERR_WECHAT_SENT_FAILED'
  /** 准备分享请求时抛出的其它异常 */
  | 'ERR_WECHAT_SHARE_PREPARE_FAILED'
  /** 缩略图不是有效图片 */
  | 'ERR_WECHAT_THUMB_INVALID'
  /** 缩略图压不到 32KB 以内 */
  | 'ERR_WECHAT_THUMB_TOO_LARGE'
  /** 当前微信版本不支持该功能（-5） */
  | 'ERR_WECHAT_UNSUPPORTED'
  /** 用户在微信里明确点了取消（微信 errCode -2）。**最常见的一种，通常不需要提示** */
  | 'ERR_WECHAT_USER_CANCELLED';

/**
 * 一次微信交互的结果。**所有方法都 resolve 成这个形状，永远不会 reject**。
 *
 * 「用户点了取消」是正常的流程分支而不是异常，逼调用方 try/catch 再比字符串是错的；
 * 而且 Expo 的 `Promise.reject` 会把 message 吞掉（JS 侧只剩 `undefined reason`）。
 *
 * 这是个**闭合的判别联合**：两个分支字段完全一致，缺的那些是 `null` 而不是不存在。
 * 所以既能直接解构 / `JSON.stringify` 上报，
 * 又能靠 `if (result.ok)` 收窄——收窄之后 `payload` 不再是可空的，不用写 `!`：
 *
 * ```ts
 * const result = await sendWechatAuth();
 * if (!result.ok) {
 *   console.warn(result.code, result.message);  // 这里 code / message 必然有值
 *   return;
 * }
 * await exchangeToken(result.payload.code);     // 这里 payload 必然存在
 * ```
 */
export type WechatResult<T extends WechatResponsePayload = WechatResponsePayload> =
  | { code: null; kind: WechatRespKind; message: null; ok: true; payload: T }
  | { code: WechatResultCode; kind: WechatRespKind; message: string; ok: false; payload: null };

/** 第一段回调：请求已经交给微信，App 正在切走 */
export type WechatRequestSentEvent = {
  kind: WechatRespKind;
  /** 微信是否受理了这次唤起；false 说明没能拉起微信，紧接着会收到失败的 onResponse */
  ok: boolean;
};

export type WechatModuleEvents = {
  /**
   * 请求已送达微信、App 即将切走。**只表示唤起成功，不是分享/登录的结果**。
   *
   * 到这一刻为止的耗时是「本地准备」——下载媒体、压缩缩略图；
   * 之后的耗时才是「用户在微信里操作」。上层可以据此切换 loading 文案。
   */
  onRequestSent: (event: WechatRequestSentEvent) => void;
  /**
   * 全量观察通道，成功失败都会触发，形状和方法返回值完全一致。
   *
   * 正常流程请直接 await 对应方法，**两者会同时触发**，别重复处理。
   */
  onResponse: (result: WechatResult) => void;
};

// ------------------------------------------------- Universal Link 自检

/**
 * 自检步骤，顺序即执行顺序。
 * `launchWechat` 和 `backToCurrentApp` 两步会真的把微信拉起来再跳回来。
 */
export type WechatUniversalLinkStep =
  /** 由微信返回当前 App 检测 */
  | 'backToCurrentApp'
  /** 最终结果，走到这一步说明全部通过 */
  | 'final'
  /** App 拉起微信检测 */
  | 'launchWechat'
  /** 传入参数检测（AppID / Universal Link 本身写得对不对） */
  | 'params'
  /** 微信 SDK 内部操作检测 */
  | 'sdkInnerOperation'
  /** 当前系统版本检测 */
  | 'systemVersion'
  /** 微信客户端版本检测 */
  | 'wechatVersion';

export type WechatUniversalLinkStepResult = {
  /** 微信给出的错误信息，成功时为空串 */
  errorInfo: string;
  step: WechatUniversalLinkStep;
  success: boolean;
  /** 微信给出的修正建议，照着改即可 */
  suggestion: string;
};

export type WechatUniversalLinkCheckResult = {
  /** 人话版结论，可以直接展示 */
  message: string;
  /** 是否全部步骤通过 */
  ok: boolean;
  /** 已执行到的步骤，失败时最后一条就是卡住的地方 */
  steps: WechatUniversalLinkStepResult[];
};

// ---------------------------------------------------------------- 分享

/** 分享目标场景。小程序卡片只支持 `session`，传别的会被强制改回去。 */
export type WechatShareScene = 'favorite' | 'session' | 'timeline';

export type WechatMiniProgramType = 'preview' | 'release' | 'test';

/**
 * 媒体来源，支持四种写法：
 * - `https://…` / `http://…` 远程地址（原生下载）
 * - `file://…` 或裸绝对路径（expo-file-system、相册导出的临时文件）
 * - `data:image/png;base64,…`
 */
export type WechatMediaSource = string;

/** 除文本外所有分享类型共有的字段 */
type ShareCommonOptions = {
  description?: string;
  scene?: WechatShareScene;
  /** 缩略图来源。微信上限 32KB，超了原生会自动缩尺寸 + 压 JPEG */
  thumb?: WechatMediaSource;
  title?: string;
};

export type ShareTextOptions = {
  scene?: WechatShareScene;
  /** 长度必须大于 0 且小于 10K */
  text: string;
};

export type ShareImageOptions = ShareCommonOptions & {
  /** 上限 10MB */
  image: WechatMediaSource;
};

export type ShareWebpageOptions = ShareCommonOptions & {
  /** 上限 10KB */
  url: string;
};

export type ShareVideoOptions = ShareCommonOptions & {
  lowBandUrl?: string;
  /** 上限 10KB */
  url: string;
};

export type ShareMusicOptions = ShareCommonOptions & {
  /** 音乐数据地址，微信直接播放 */
  dataUrl: string;
  lowBandDataUrl?: string;
  lowBandUrl?: string;
  songAlbumUrl?: string;
  /** 上限 32K */
  songLyric?: string;
  /** 音乐网页地址，点开后跳转 */
  url: string;
};

export type ShareMusicVideoOptions = ShareCommonOptions & {
  albumName?: string;
  /** 时长，单位毫秒 */
  duration?: number;
  /** 高清专辑封面，上限 1MB */
  hdAlbumThumb?: WechatMediaSource;
  identification?: string;
  /** 发行时间，Unix 时间戳（秒） */
  issueDate?: number;
  musicDataUrl: string;
  musicGenre?: string;
  musicOperationUrl?: string;
  musicUrl: string;
  /** 歌手名，上限 1KB */
  singerName: string;
  /** 上限 32K */
  songLyric?: string;
};

export type ShareFileOptions = ShareCommonOptions & {
  /** 上限 10MB */
  file: WechatMediaSource;
  /** 含点，如 `.pdf`；不传则从 `file` 推断，上限 64 字节 */
  fileExtension?: string;
};

export type ShareEmoticonOptions = ShareCommonOptions & {
  /** 表情图片（gif / png），上限 10MB */
  emoticon: WechatMediaSource;
};

export type ShareMiniProgramOptions = ShareCommonOptions & {
  disableForward?: boolean;
  /** 卡片封面大图，上限 128KB；不传则退化成 thumb */
  hdImage?: WechatMediaSource;
  miniProgramType?: WechatMiniProgramType;
  path?: string;
  /** 小程序原始 ID，形如 gh_xxxxxxxx */
  userName: string;
  /** 兼容低版本微信的网页地址，上限 10KB */
  webpageUrl: string;
  withShareTicket?: boolean;
};
