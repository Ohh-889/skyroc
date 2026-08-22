import { HStack, Image, ProgressView, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  activityBackgroundTint,
  font,
  foregroundStyle,
  frame,
  monospacedDigit,
  padding,
  tint
} from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity } from 'expo-widgets';

import type { QueueActivityProps } from './types';

/**
 * 门诊排队叫号的 Live Activity。
 *
 * 名字 `ClinicQueue` 是这类活动的标识，`start` 出来的每个实例都挂在它下面；改名等于换了一种活动，
 * 已经在运行的旧卡片会失联，所以上线之后别动。
 *
 * 返回值的槽位分别对应 iOS 的四种展示位：
 *
 * ```text
 * banner                            锁屏 / 通知中心 / 没有灵动岛的机型
 * compactLeading + compactTrailing  灵动岛收起态（药丸的左右两侧）
 * minimal                           同时有多个活动时，被挤成一个小圆点
 * expanded*                         长按灵动岛展开后的大卡片
 * ```
 *
 * 不给的槽位系统会留空，但收起态的三个建议都写，否则药丸上会出现空洞。
 */
export const ClinicQueueActivity = createLiveActivity<QueueActivityProps>('ClinicQueue', props => {
  'widget';

  // ⚠️ 最容易踩的坑：带 'widget' 指令的函数体会被 babel 整段抽成源码字符串，
  // 交给 widget 进程重新求值。那边的全局作用域只有 @expo/ui 的组件和 modifier，
  // 本模块顶层的常量、工具函数、import 进来的东西**一个都拿不到**。
  // 所以下面这些表全部写在函数内部，挪到外面运行时会直接 ReferenceError。
  const THEME = {
    called: { accent: '#16A34A', symbol: 'bell.badge.fill' },
    done: { accent: '#94A3B8', symbol: 'checkmark.circle.fill' },
    upcoming: { accent: '#F59E0B', symbol: 'figure.walk' },
    waiting: { accent: '#2563EB', symbol: 'person.2.fill' }
  } as const;

  const HEADLINE = {
    called: `请到 ${props.room ?? '诊室'} 就诊`,
    done: '就诊已结束',
    upcoming: '马上轮到你，请回候诊区',
    waiting: `前面还有 ${props.aheadCount} 位`
  };

  const CAPTION = {
    called: '过号顺延两位，请尽快到场',
    done: '祝早日康复',
    upcoming: `${props.department} · ${props.doctor}`,
    waiting: `${props.department} · ${props.doctor}`
  };

  const TRAILING_LABEL = {
    called: '到场倒计时',
    done: '已完成',
    upcoming: '还需等待',
    waiting: '还需等待'
  };

  const { accent, symbol } = THEME[props.stage];
  const muted = '#94A3B8';

  const isCalled = props.stage === 'called';
  const isDone = props.stage === 'done';

  // 倒计时交给 SwiftUI 自己走：两端时间由 App 侧一次性传进来，widget 里不碰 Date.now()。
  // 否则每过一分钟就得从 App update 一次，白白吃掉 ActivityKit 的更新预算，
  // 而且 App 被系统挂起时根本发不出这次 update，数字就停在那不动了。
  const countdown =
    props.calledAt && props.deadlineAt
      ? { lower: new Date(props.calledAt), upper: new Date(props.deadlineAt) }
      : null;

  const progress = props.totalAhead > 0 ? (props.totalAhead - props.aheadCount) / props.totalAhead : 1;

  const bar = isDone ? null : (
    <ProgressView
      value={progress}
      modifiers={[tint(accent)]}
    />
  );

  return {
    banner: (
      <VStack
        alignment="leading"
        spacing={10}
        modifiers={[padding({ all: 16 }), activityBackgroundTint('#0F172A')]}
      >
        <HStack spacing={8}>
          <Image
            color={accent}
            size={15}
            systemName={symbol}
          />

          <Text modifiers={[font({ size: 14, weight: 'semibold' })]}>{CAPTION[props.stage]}</Text>

          <Spacer />

          <Text modifiers={[font({ design: 'rounded', size: 14, weight: 'bold' }), foregroundStyle(accent)]}>
            {props.ticketNumber}
          </Text>
        </HStack>

        <HStack
          alignment="firstTextBaseline"
          spacing={8}
        >
          <Text modifiers={[font({ size: 22, weight: 'bold' })]}>{HEADLINE[props.stage]}</Text>

          <Spacer />

          {isCalled && countdown ? (
            <Text
              countsDown
              timerInterval={countdown}
              modifiers={[
                font({ design: 'rounded', size: 22, weight: 'bold' }),
                foregroundStyle(accent),
                monospacedDigit()
              ]}
            />
          ) : null}
        </HStack>

        {bar}

        {isCalled || isDone ? (
          <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>{CAPTION[props.stage]}</Text>
        ) : (
          // Text(date:) 让 SwiftUI 按用户所在时区和 12/24 小时制自己格式化，
          // 顺带解决了系统设置变更后文案不刷新的问题
          <HStack spacing={3}>
            <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>预计</Text>

            <Text
              date={new Date(props.estimatedAt)}
              dateStyle="time"
              modifiers={[font({ size: 12, weight: 'medium' }), foregroundStyle(muted)]}
            />

            <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>叫号</Text>
          </HStack>
        )}
      </VStack>
    ),

    compactLeading: (
      <Image
        color={accent}
        size={14}
        systemName={symbol}
      />
    ),

    // 药丸里的宽度是像素级的：倒计时数字不定宽每秒会抖一下，
    // 所以既要 monospacedDigit，也要给一个固定 frame
    compactTrailing:
      isCalled && countdown ? (
        <Text
          countsDown
          timerInterval={countdown}
          modifiers={[
            font({ design: 'rounded', size: 13, weight: 'semibold' }),
            foregroundStyle(accent),
            monospacedDigit(),
            frame({ width: 46 })
          ]}
        />
      ) : (
        <Text modifiers={[font({ design: 'rounded', size: 13, weight: 'semibold' }), foregroundStyle(accent)]}>
          {isDone ? '完成' : `${props.aheadCount} 位`}
        </Text>
      ),

    expandedBottom: (
      <VStack
        alignment="leading"
        spacing={6}
      >
        <Text modifiers={[font({ size: 15, weight: 'semibold' })]}>{HEADLINE[props.stage]}</Text>

        {bar}

        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>{CAPTION[props.stage]}</Text>
      </VStack>
    ),

    expandedLeading: (
      <VStack
        alignment="leading"
        spacing={2}
      >
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>{props.department}</Text>

        <Text modifiers={[font({ design: 'rounded', size: 18, weight: 'bold' }), foregroundStyle(accent)]}>
          {props.ticketNumber}
        </Text>
      </VStack>
    ),

    expandedTrailing: (
      <VStack
        alignment="trailing"
        spacing={2}
      >
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>{TRAILING_LABEL[props.stage]}</Text>

        {isCalled && countdown ? (
          <Text
            countsDown
            timerInterval={countdown}
            modifiers={[
              font({ design: 'rounded', size: 18, weight: 'bold' }),
              foregroundStyle(accent),
              monospacedDigit()
            ]}
          />
        ) : (
          <Text modifiers={[font({ design: 'rounded', size: 18, weight: 'bold' }), foregroundStyle(accent)]}>
            {isDone ? '—' : `${props.aheadCount} 位`}
          </Text>
        )}
      </VStack>
    ),

    minimal: (
      <Image
        color={accent}
        size={13}
        systemName={symbol}
      />
    )
  };
});
