import { type ReactNode, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WechatLaunchOptions, WechatResult, WechatShareResponse, WechatShareScene } from '@skyroc/expo-wechat';
import {
  addWechatResponseListener,
  checkWechatUniversalLink,
  consumePendingWechatShare,
  getWechatApiVersion,
  getWechatInstallUrl,
  isWechatInstalled,
  openWechat,
  sendWechatAuth,
  shareEmoticon,
  shareFile,
  shareImage,
  shareMiniProgram,
  shareMusic,
  shareMusicVideo,
  shareText,
  shareVideo,
  shareWebpage
} from '@skyroc/expo-wechat';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DemoHeader } from './modules/DemoHeader';

/** 演示用的远程素材，换成你自己的地址即可。 缩略图故意用了一张大图，用来验证原生侧的 32KB 自动压缩。 */
const Demo = {
  emoticon: 'https://picsum.photos/seed/wechat-emoticon/240/240',
  file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  image: 'https://picsum.photos/seed/wechat-image/720/960',
  music: 'https://www.w3schools.com/html/horse.mp3',
  /** 512×512 仍然超 32KB，压缩逻辑照样能验到，但下载比 1200×1200 快得多 */
  thumb: 'https://picsum.photos/seed/wechat-thumb/512/512',
  video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  webpage: 'https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Share_and_Favorites/iOS.html'
} as const;

interface ShareAction {
  /** 按钮文案 */
  label: string;
  /** 已知的限制或前置条件，展示在按钮下方 */
  note?: string;
  /**
   * 真正发起分享。
   *
   * @param scene 由页面顶部的开关决定
   * @param launch 第一段回调，展开进 options 即可；用来区分「本地准备中」和「等待微信」
   */
  run: (scene: WechatShareScene, launch: WechatLaunchOptions) => Promise<WechatResult<WechatShareResponse>>;
}

/** 九种分享类型。放在组件外是因为它不闭包任何组件状态， scene 通过参数传进来即可。 */
const SHARE_ACTIONS: ShareAction[] = [
  {
    label: '文本',
    run: (scene, launch) => shareText({ ...launch, scene, text: '来自 expo-templete 的微信分享测试' })
  },
  {
    label: '图片',
    note: '原图 ≤10MB，缩略图自动压到 32KB',
    run: (scene, launch) =>
      shareImage({
        ...launch,
        description: '一张随机图',
        image: Demo.image,
        scene,
        thumb: Demo.thumb,
        title: '图片分享'
      })
  },
  {
    label: '网页',
    note: '最常用的一种',
    run: (scene, launch) =>
      shareWebpage({
        ...launch,
        description: '微信开放平台 iOS 分享与收藏文档',
        scene,
        thumb: Demo.thumb,
        title: '网页分享',
        url: Demo.webpage
      })
  },
  {
    label: '视频',
    note: '传播放地址，不是视频文件',
    run: (scene, launch) =>
      shareVideo({
        ...launch,
        description: 'Big Buck Bunny',
        scene,
        thumb: Demo.thumb,
        title: '视频分享',
        url: Demo.video
      })
  },
  {
    label: '音乐',
    note: 'url 是跳转网页，dataUrl 是微信直接播的音频',
    run: (scene, launch) =>
      shareMusic({
        ...launch,
        dataUrl: Demo.music,
        description: '一段测试音频',
        scene,
        thumb: Demo.thumb,
        title: '音乐分享',
        url: Demo.webpage
      })
  },
  {
    label: '音乐视频',
    note: '带歌手 / 时长 / 歌词的富卡片',
    run: (scene, launch) =>
      shareMusicVideo({
        ...launch,
        description: '音乐视频卡片',
        duration: 30_000,
        musicDataUrl: Demo.music,
        musicUrl: Demo.webpage,
        scene,
        singerName: '测试歌手',
        songLyric: '[00:00.00] 这里是歌词',
        thumb: Demo.thumb,
        title: '音乐视频分享'
      })
  },
  {
    label: '文件',
    note: '后缀名不传会从 URL 推断',
    run: (scene, launch) =>
      shareFile({
        ...launch,
        description: '一个 PDF',
        file: Demo.file,
        scene,
        thumb: Demo.thumb,
        title: 'dummy.pdf'
      })
  },
  {
    label: '表情',
    note: '微信只认 gif / png，这里的素材是 jpeg，预期会被微信拒绝',
    run: (scene, launch) =>
      shareEmoticon({
        ...launch,
        emoticon: Demo.emoticon,
        scene,
        thumb: Demo.thumb,
        title: '表情分享'
      })
  },
  {
    label: '小程序',
    note: 'userName 要换成真实 gh_ 开头的原始 ID，否则微信会报错',
    run: (_scene, launch) =>
      shareMiniProgram({
        ...launch,
        description: '小程序卡片',
        hdImage: Demo.image,
        path: 'pages/index?from=demo',
        thumb: Demo.thumb,
        title: '小程序分享',
        userName: 'gh_0000000000',
        webpageUrl: Demo.webpage
      })
  }
];

const SCENES: { label: string; value: WechatShareScene }[] = [
  { label: '会话', value: 'session' },
  { label: '朋友圈', value: 'timeline' },
  { label: '收藏', value: 'favorite' }
];

interface LogEntry {
  /** 触发这条记录的动作名 */
  action: string;
  /** 成功时是返回值，失败时是「错误码 · 消息」 */
  detail: string;
  /** 耗时，单位毫秒；事件回调没有耗时概念，传 0 */
  duration: number;
  id: number;
  ok: boolean;
}

/** 日志自增 id。放模块级是因为它不该参与渲染 */
let logSeq = 0;

/** 把任意返回值翻成一条日志，统一 WechatResult / 布尔 / 异常三种情况 */
const describe = (action: string, value: unknown): Omit<LogEntry, 'duration' | 'id'> => {
  if (value instanceof Error) {
    return { action, detail: `未预期的异常 · ${value.message}`, ok: false };
  }
  if (value !== null && typeof value === 'object' && 'ok' in value) {
    const result = value as WechatResult;
    return result.ok
      ? { action, detail: JSON.stringify(result.payload), ok: true }
      : { action, detail: `${result.code} · ${result.message}`, ok: false };
  }
  return { action, detail: JSON.stringify(value), ok: true };
};

const createEntry = (entry: Omit<LogEntry, 'id'>): LogEntry => {
  logSeq += 1;
  return { ...entry, id: logSeq };
};

interface SectionCardProps {
  /** 卡片内容 */
  children: ReactNode;
  /** 卡片标题 */
  title: string;
}

const SectionCard = (props: SectionCardProps) => {
  const { children, title } = props;

  return (
    <ThemedView
      type="backgroundElement"
      style={styles.card}
    >
      <ThemedText type="smallBold">{title}</ThemedText>
      {children}
    </ThemedView>
  );
};

interface ActionButtonProps {
  /** 置灰并忽略点击 */
  disabled?: boolean;
  /** 按钮文案 */
  label: string;
  /** 正在执行：显示转圈。分享要先下载媒体和缩略图，不给反馈会以为没点上 */
  loading?: boolean;
  /** 转圈时替换掉的文案，用来区分「准备中」和「等待微信」 */
  loadingLabel?: string;
  /** 点击回调 */
  onPress: () => void;
  /** 选中态（用于场景切换） */
  selected?: boolean;
}

const ActionButton = (props: ActionButtonProps) => {
  const { disabled = false, label, loading = false, loadingLabel, onPress, selected = false } = props;
  const theme = useTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: selected ? theme.backgroundSelected : theme.background },
        (pressed || disabled) && styles.pressed
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={theme.text}
        />
      ) : null}
      <ThemedText type="small">{loading ? (loadingLabel ?? label) : label}</ThemedText>
    </Pressable>
  );
};

export default function WechatDemoScreen() {
  const theme = useTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [scene, setScene] = useState<WechatShareScene>('session');
  const [busy, setBusy] = useState<string | null>(null);
  // 两段式：preparing 是我们在下载媒体 / 压缩缩略图，waiting 是已切到微信、等用户操作
  const [stage, setStage] = useState<'preparing' | 'waiting'>('preparing');

  // 事件通道是全量的，正常流程下和 Promise 会同时触发，这里正好能看出来
  useEffect(() => {
    const subscription = addWechatResponseListener(result => {
      setLogs(prev =>
        [
          createEntry({
            action: `event:${result.kind}`,
            detail: result.ok ? JSON.stringify(result.payload) : `${result.code} · ${result.message}`,
            duration: 0,
            ok: result.ok
          }),
          ...prev
        ].slice(0, 50)
      );
    });

    return () => subscription.remove();
  }, []);

  // 冷启动兜底：App 被杀掉后从微信返回，结果先落在原生侧
  useEffect(() => {
    consumePendingWechatShare().then(result => {
      if (!result) return;

      setLogs(prev => [
        createEntry({
          action: 'cold-start:share',
          detail: result.ok ? JSON.stringify(result.payload) : `${result.code} · ${result.message}`,
          duration: 0,
          ok: result.ok
        }),
        ...prev
      ]);
    });
  }, []);

  const run = async (action: string, task: () => Promise<unknown>) => {
    setBusy(action);
    setStage('preparing');
    const startedAt = Date.now();

    // 模块永远不 reject，失败以 { ok: false, code, message } 返回，
    // 这里的 catch 只会兜到真正的 JS 异常
    const value = await task().catch(error => error as Error);
    const duration = Date.now() - startedAt;

    setLogs(prev => [createEntry({ ...describe(action, value), duration }), ...prev].slice(0, 50));
    setBusy(null);
  };

  return (
    <ThemedView style={styles.container}>
      <DemoHeader title="微信能力测试" />

      <SafeAreaView
        edges={['bottom']}
        style={styles.safeArea}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <SectionCard title="环境">
            <ThemedText
              type="small"
              themeColor="textSecondary"
            >
              微信登录 / 分享都需要真机 + 已安装微信，模拟器上一律返回未安装。 按钮上的「准备中…」是本地在下载媒体 /
              压缩缩略图，「等待微信…」是已经切到微信、 在等你操作——两段的分界就是 onLaunched
              回调。同一张缩略图第二次走缓存。
            </ThemedText>
            <ThemedView
              type="backgroundElement"
              style={styles.row}
            >
              <ActionButton
                disabled={busy !== null}
                label="是否安装微信"
                loading={busy === 'isWechatInstalled'}
                onPress={() => run('isWechatInstalled', isWechatInstalled)}
              />
              <ActionButton
                disabled={busy !== null}
                label="打开微信"
                loading={busy === 'openWechat'}
                onPress={() => run('openWechat', openWechat)}
              />
              <ActionButton
                disabled={busy !== null}
                label="SDK 版本"
                loading={busy === 'getWechatApiVersion'}
                onPress={() => run('getWechatApiVersion', getWechatApiVersion)}
              />
              <ActionButton
                disabled={busy !== null}
                label="安装地址"
                loading={busy === 'getWechatInstallUrl'}
                onPress={() => run('getWechatInstallUrl', getWechatInstallUrl)}
              />
            </ThemedView>
          </SectionCard>

          <SectionCard title="Universal Link 自检">
            <ThemedText
              type="small"
              themeColor="textSecondary"
            >
              仅调试用，微信头文件明确写了别在正式环境调。会真的切到微信再跳回来，只能真机跑。 排查
              ERR_WECHAT_NO_RESPONSE 就从这里开始——失败时看最后一条 step 的 suggestion。
            </ThemedText>
            <ThemedView
              type="backgroundElement"
              style={styles.row}
            >
              <ActionButton
                disabled={busy !== null}
                label="检查 Universal Link"
                loading={busy === 'checkWechatUniversalLink'}
                loadingLabel="自检中（会切到微信）…"
                onPress={() => run('checkWechatUniversalLink', checkWechatUniversalLink)}
              />
            </ThemedView>
          </SectionCard>

          <SectionCard title="登录">
            <ThemedText
              type="small"
              themeColor="textSecondary"
            >
              成功后拿到的是 code，要交给自己的后端换 token；这里只展示原始返回，不写入登录态
            </ThemedText>
            <ThemedView
              type="backgroundElement"
              style={styles.row}
            >
              <ActionButton
                disabled={busy !== null}
                label="微信授权登录"
                loading={busy === 'sendWechatAuth'}
                loadingLabel={stage === 'preparing' ? '准备中…' : '等待微信…'}
                onPress={() =>
                  run('sendWechatAuth', () =>
                    sendWechatAuth({
                      onLaunched: () => setStage('waiting'),
                      scope: 'snsapi_userinfo',
                      state: `demo_${logSeq}`
                    })
                  )
                }
              />
            </ThemedView>
          </SectionCard>

          <SectionCard title="分享场景">
            <ThemedText
              type="small"
              themeColor="textSecondary"
            >
              小程序卡片只支持会话，选别的会被原生强制改回去
            </ThemedText>
            <ThemedView
              type="backgroundElement"
              style={styles.row}
            >
              {SCENES.map(item => (
                <ActionButton
                  key={item.value}
                  label={item.label}
                  onPress={() => setScene(item.value)}
                  selected={scene === item.value}
                />
              ))}
            </ThemedView>
          </SectionCard>

          <SectionCard title="分享与收藏">
            {SHARE_ACTIONS.map(action => (
              <ThemedView
                key={action.label}
                type="backgroundElement"
                style={styles.shareRow}
              >
                <ActionButton
                  disabled={busy !== null}
                  label={action.label}
                  loading={busy === `share:${action.label}`}
                  loadingLabel={stage === 'preparing' ? '准备中…' : '等待微信…'}
                  onPress={() =>
                    run(`share:${action.label}`, () => action.run(scene, { onLaunched: () => setStage('waiting') }))
                  }
                />
                {action.note ? (
                  <ThemedText
                    type="small"
                    themeColor="textSecondary"
                    style={styles.note}
                  >
                    {action.note}
                  </ThemedText>
                ) : null}
              </ThemedView>
            ))}
          </SectionCard>

          <SectionCard title={`调用记录（${logs.length}）`}>
            {logs.length === 0 ? (
              <ThemedText
                type="small"
                themeColor="textSecondary"
              >
                还没有调用记录
              </ThemedText>
            ) : (
              logs.map(entry => (
                <ThemedView
                  key={entry.id}
                  type="backgroundElement"
                  style={styles.logEntry}
                >
                  <ThemedText
                    type="smallBold"
                    style={{ color: entry.ok ? theme.text : '#E5484D' }}
                  >
                    {entry.ok ? '✓' : '✗'} {entry.action}
                    {entry.duration > 0 ? ` · ${entry.duration}ms` : ''}
                  </ThemedText>
                  <ThemedText
                    type="code"
                    style={styles.logDetail}
                  >
                    {entry.detail}
                  </ThemedText>
                </ThemedView>
              ))
            )}
          </SectionCard>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center'
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three
  },
  card: {
    borderRadius: Spacing.three,
    gap: Spacing.two,
    padding: Spacing.three
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two
  },
  shareRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two
  },
  button: {
    alignItems: 'center',
    borderRadius: Spacing.two,
    flexDirection: 'row',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two
  },
  pressed: {
    opacity: 0.5
  },
  note: {
    flexShrink: 1
  },
  logEntry: {
    borderRadius: Spacing.two,
    gap: Spacing.half,
    padding: Spacing.two
  },
  logDetail: {
    fontSize: 11,
    lineHeight: 16
  }
});
