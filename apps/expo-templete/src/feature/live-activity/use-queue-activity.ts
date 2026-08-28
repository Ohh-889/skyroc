import * as Linking from 'expo-linking';
import type { EventSubscription } from 'expo-modules-core';
import type { LiveActivity } from 'expo-widgets';
import { addPushToStartTokenListener, after } from 'expo-widgets';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { ClinicQueueActivity } from './queue-activity';
import type { QueueActivityProps } from './types';

/** Live Activity 需要 iOS 16.2+（16.1 只有锁屏卡片，灵动岛的展开态还没有） */
const MIN_IOS_VERSION = 16.2;

const IS_SUPPORTED = Platform.OS === 'ios' && Number.parseFloat(String(Platform.Version)) >= MIN_IOS_VERSION;

/** 点灵动岛回到 App 时落地的页面 */
const DEEP_LINK = Linking.createURL('/demo/live-activity');

/** 结束后卡片在锁屏上继续停留的时间 */
const DISMISS_DELAY = 30_000;

/** UseQueueActivity 的返回值 */
export interface QueueActivityController {
  /** 当前推给灵动岛的内容；冷启动恢复出来的实例拿不到历史内容，这里会是 null */
  content: QueueActivityProps | null;

  /** 结束活动。`final` 是最后一屏内容，卡片会带着它在锁屏上多停一会儿再消失 */
  end: (final?: Partial<QueueActivityProps>) => Promise<void>;

  /** 是否有正在运行的活动（含冷启动恢复出来的） */
  isRunning: boolean;

  /** 当前设备能不能显示 Live Activity */
  isSupported: boolean;

  /** 本条活动的 APNs token，交给后端就能远程更新这张卡片 */
  pushToken: string | null;

  /** 应用级的 push-to-start token（iOS 17.2+），后端拿着它能在 App 没开的时候把卡片推起来 */
  pushToStartToken: string | null;

  /** 取号，创建活动。返回是否创建成功 */
  start: (initial: QueueActivityProps) => Promise<boolean>;

  /** 增量更新。内部合并成全量再下发，因为 ActivityKit 没有补丁语义 */
  update: (patch: Partial<QueueActivityProps>) => Promise<void>;
}

/**
 * 把「一条排队 Live Activity」的完整生命周期收在一个 hook 里。
 *
 * 真实项目里前台 update 只是兜底，主路径是后端拿 `pushToken` 推 APNs——用户锁着屏、App 被挂起时， 只有推送能让灵动岛动起来。所以这个 hook 的重点其实是把两个 token 拿到手并上报给自己的服务端。
 */
export function useQueueActivity(): QueueActivityController {
  const [content, setContent] = useState<QueueActivityProps | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [pushToStartToken, setPushToStartToken] = useState<string | null>(null);

  const activityRef = useRef<LiveActivity<QueueActivityProps> | null>(null);
  const contentRef = useRef<QueueActivityProps | null>(null);
  const tokenSubscriptionRef = useRef<EventSubscription | null>(null);

  /** Token 有两条到达路径，都得接： - `getPushToken()` 立刻问一次，恢复出来的实例通常已经有了； - 监听事件，新建的实例要等系统签发，第一次问多半是 null，之后才补上，系统还会不定期轮换。 */
  const bindPushToken = useCallback((activity: LiveActivity<QueueActivityProps>) => {
    tokenSubscriptionRef.current?.remove();
    tokenSubscriptionRef.current = activity.addPushTokenListener(event => setPushToken(event.pushToken));

    activity.getPushToken().then(token => {
      if (token) setPushToken(token);
    });
  }, []);

  // 冷启动恢复：Live Activity 活得比进程久，用户划掉 App 卡片还在锁屏上。
  // 这里把实例引用捡回来，否则后面的 update 会以为没有活动而重新 start，锁屏上就出现两张卡。
  useEffect(() => {
    const [existing] = ClinicQueueActivity.getInstances();

    if (existing) {
      activityRef.current = existing;
      setIsRunning(true);
      bindPushToken(existing);
      // 内容取不回来，真实项目在这里向后端查一次当前排队状态再 update 一遍，
      // 让卡片和服务端重新对齐——App 被杀期间的推送可能已经改过它了。
    }

    return () => {
      // 故意不在卸载时 end：活动的生命周期属于这单业务，不属于这个页面。
      tokenSubscriptionRef.current?.remove();
      tokenSubscriptionRef.current = null;
    };
  }, [bindPushToken]);

  // push-to-start 是应用级 token，和具体实例无关，进 App 就该拿到并上报
  useEffect(() => {
    if (!IS_SUPPORTED) return undefined;

    const subscription = addPushToStartTokenListener(event => setPushToStartToken(event.activityPushToStartToken));

    return () => subscription.remove();
  }, []);

  const start = useCallback(
    async (initial: QueueActivityProps) => {
      if (!IS_SUPPORTED || activityRef.current) return false;

      try {
        // 第二个参数是点卡片回 App 的落地地址，不给就只能打开首页
        const activity = ClinicQueueActivity.start(initial, DEEP_LINK);

        activityRef.current = activity;
        contentRef.current = initial;
        setContent(initial);
        setIsRunning(true);
        bindPushToken(activity);

        return true;
      } catch {
        // 用户在「设置 → App → 实时活动」里关掉了，或同时运行的活动数已达系统上限
        return false;
      }
    },
    [bindPushToken]
  );

  const update = useCallback(async (patch: Partial<QueueActivityProps>) => {
    const activity = activityRef.current;

    if (!activity || !contentRef.current) return;

    // 走 ref 而不是 state，定时器和事件回调里读到的才一定是最新内容
    const next = { ...contentRef.current, ...patch };

    contentRef.current = next;
    setContent(next);

    await activity.update(next);
  }, []);

  const end = useCallback(async (final?: Partial<QueueActivityProps>) => {
    const activity = activityRef.current;

    if (!activity) return;

    const last = contentRef.current ? { ...contentRef.current, ...final } : undefined;

    activityRef.current = null;
    contentRef.current = null;
    tokenSubscriptionRef.current?.remove();
    tokenSubscriptionRef.current = null;

    setContent(null);
    setIsRunning(false);
    setPushToken(null);

    // after 让「已结束」这一屏在锁屏上多留一会儿再自己消失（系统允许的窗口是四小时内）；
    // 'immediate' 是立刻抹掉，'default' 由系统决定。
    await activity.end(after(new Date(Date.now() + DISMISS_DELAY)), last);
  }, []);

  return {
    content,
    end,
    isRunning,
    isSupported: IS_SUPPORTED,
    pushToStartToken,
    pushToken,
    start,
    update
  };
}
