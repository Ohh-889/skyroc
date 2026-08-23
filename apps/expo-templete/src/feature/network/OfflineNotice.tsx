import { Notify } from '@skyroc/native-ui';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { OFFLINE_MESSAGE } from './network-store';
import { useIsOnline } from './use-is-online';

/**
 * 断网多久后才提示。
 *
 * WiFi 掉到蜂窝、切基站、过隧道都会有几百毫秒的空窗，立刻弹会变成一条红条一直在闪。
 * 真正断网的用户等这一秒无所谓，误报被这一秒全挡掉了。
 */
const OFFLINE_DELAY = 1_000;

/** 「网络已恢复」停留时长。它只是个回执，不该赖着不走 */
const RESTORED_DURATION = 2_000;

const RESTORED_MESSAGE = '网络已恢复';

/** hidden：没什么可说的；offline：正断着；restored：刚恢复，报一声就走 */
type NoticeState = 'hidden' | 'offline' | 'restored';

/**
 * 全局断网提示条，挂在根 layout 上。
 *
 * 用常驻横幅而不是每个页面各弹各的 toast：断网是**一段状态**不是一个事件，用户看到条还在，就知道现在
 * 点什么都没用，不会反复戳按钮；toast 弹完就没了，只会让人以为是这一次操作倒霉。
 *
 * 只提示，不拦截操作：能不能发请求由 `onlineManager` 和请求本身决定（见 `feature/query/query-provider`）。
 */
export const OfflineNotice = () => {
  const isOnline = useIsOnline();

  const [state, setState] = useState<NoticeState>('hidden');

  /**
   * 断网条有没有真的露过脸。
   *
   * 「已恢复」只该给看见过断网条的人看：没到 OFFLINE_DELAY 就恢复的抖动，用户什么都没察觉，
   * 这时候冒一句「网络已恢复」反而是凭空制造了一次故障感。
   */
  const noticedOffline = useRef(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (!isOnline) {
      timer = setTimeout(() => {
        noticedOffline.current = true;

        setState('offline');
      }, OFFLINE_DELAY);
    } else if (noticedOffline.current) {
      noticedOffline.current = false;

      setState('restored');

      timer = setTimeout(() => setState('hidden'), RESTORED_DURATION);
    }

    // 断网期间又恢复时，上一轮那个还没到点的 OFFLINE_DELAY 定时器必须撤掉
    return () => clearTimeout(timer);
  }, [isOnline]);

  const offline = state === 'offline';

  return (
    // 容器常驻且不拦触摸：Notify 关闭时若父节点跟着卸载，Reanimated 的退场动画会被连根拔掉；
    // box-none 让红条本身可点、红条之外的区域照常透传给页面
    <View
      className="absolute inset-x-0 top-0"
      pointerEvents="box-none"
    >
      <Notify
        // 安全区补偿落在带背景色的根节点上，色块才能一直铺到状态栏底下
        className="pt-safe"
        // 何时收起由上面的状态机说了算，别再让 Notify 自己计时
        duration={0}
        message={offline ? OFFLINE_MESSAGE : RESTORED_MESSAGE}
        show={state !== 'hidden'}
        type={offline ? 'danger' : 'success'}
      />
    </View>
  );
};
