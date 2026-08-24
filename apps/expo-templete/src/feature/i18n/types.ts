/**
 * 模板内置的语言。
 *
 * 加一门语言就在这个联合类型里加一个成员，TS 会把该补的地方标红：`LOCALE_OPTIONS` 和
 * `langs/index.ts` 的 resources。词条文件本身 TS 管不到，记得一起加。
 */
export type LocaleType = 'en-US' | 'zh-CN';

/**
 * 落盘的语言**偏好**，比 `LocaleType` 多一个 `system`。
 *
 * 和主题一样，存的是偏好而不是最终生效的语言：存 `zh-CN` 和存「跟随系统、此刻系统是中文」是两件事，
 * 只落最终值的话，用户把手机语言改成英文后 App 会固执地继续说中文。
 */
export type LocalePreference = LocaleType | 'system';

/** 语言选择器里的一项 */
export interface LocaleOption {
  /**
   * 语言的**自称**：英文写 `English`，不写「英语」。
   *
   * 看不懂当前界面语言的人才需要切语言，用他看不懂的语言写选项名等于没写。也因此这份 label
   * 不进词条文件——它不该跟着界面语言变。
   */
  label: string;
  value: LocaleType;
}

/** 日期格式档位。业务页面只能从这几档里选，不要各自传 Intl options，否则同一个时间在两页长得不一样 */
export type DateStyle = 'date' | 'dateTime' | 'monthDay' | 'time' | 'weekday';

/** 能被格式化的时间入参 */
export type DateInput = Date | number | string;
