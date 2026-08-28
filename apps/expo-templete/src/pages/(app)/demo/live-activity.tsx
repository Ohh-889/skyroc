import { Button, Cell, CellGroup, Text, showFailToast, showToast } from '@skyroc/native-ui';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import type { QueueActivityProps, QueueStage } from '@/feature/live-activity';
import { useQueueActivity } from '@/feature/live-activity';

import { DemoHeader } from './modules/DemoHeader';

/** 取号时排在前面的人数 */
const TOTAL_AHEAD = 6;

/** 模拟后端叫号的节奏，真实门诊是几分钟一位，这里压到 6 秒方便看效果 */
const CALL_INTERVAL = 6_000;

/** 叫到号之后的到场时限，灵动岛上那个倒计时就是它 */
const ARRIVE_WINDOW = 5 * 60_000;

const STAGE_LABEL: Record<QueueStage, string> = {
  called: '已叫号 · 倒计时到场',
  done: '就诊结束',
  upcoming: '即将就诊',
  waiting: '排队中'
};

/** 模拟一次取号。真实项目这份数据来自挂号接口的返回 */
function createTicket(): QueueActivityProps {
  return {
    aheadCount: TOTAL_AHEAD,
    department: '口腔综合科',
    doctor: '王医生',
    estimatedAt: new Date(Date.now() + TOTAL_AHEAD * CALL_INTERVAL).toISOString(),
    stage: 'waiting',
    ticketNumber: `A${Math.floor(Math.random() * 900) + 100}`,
    totalAhead: TOTAL_AHEAD
  };
}

export default function LiveActivityDemoScreen() {
  const { content, end, isRunning, isSupported, pushToken, pushToStartToken, start, update } = useQueueActivity();

  /** 关掉后可以只用下面的按钮手动推进，方便逐帧看每个阶段的灵动岛长什么样 */
  const [auto, setAuto] = useState(true);

  /** 叫下一位。真实场景里这一步发生在后端，客户端是被 APNs 推醒的 */
  const callNext = useCallback(
    async (current: QueueActivityProps) => {
      const ahead = current.aheadCount - 1;

      if (ahead < 0) return;

      if (ahead > 0) {
        await update({
          aheadCount: ahead,
          // 每次都重算预计时间，卡片上的 Text(date:) 会自己跟着变
          estimatedAt: new Date(Date.now() + ahead * CALL_INTERVAL).toISOString(),
          stage: ahead <= 2 ? 'upcoming' : 'waiting'
        });
        return;
      }

      const calledAt = new Date();

      await update({
        aheadCount: 0,
        calledAt: calledAt.toISOString(),
        deadlineAt: new Date(calledAt.getTime() + ARRIVE_WINDOW).toISOString(),
        room: '3 诊室',
        stage: 'called'
      });
    },
    [update]
  );

  // 模拟后端把队伍往前推。叫到号之后就停下来，等用户点「就诊完成」
  useEffect(() => {
    if (!auto || !content) return undefined;
    if (content.stage === 'called' || content.stage === 'done') return undefined;

    // 更新失败（比如用户中途关掉了实时活动）就跳过这一拍，不打断后面的模拟
    const timer = setTimeout(() => {
      callNext(content).catch(() => undefined);
    }, CALL_INTERVAL);

    return () => clearTimeout(timer);
  }, [auto, callNext, content]);

  const handleStart = async () => {
    const ok = await start(createTicket());

    if (ok) {
      showToast('已取号，锁屏和灵动岛上能看到了');
      return;
    }

    showFailToast(isSupported ? '创建失败：检查系统设置里的「实时活动」开关' : '当前设备不支持 Live Activity');
  };

  const handleFinish = async () => {
    try {
      await end({ aheadCount: 0, stage: 'done' });
      showToast('已结束，卡片 30 秒后自动消失');
    } catch {
      showFailToast('结束失败，活动可能已被系统回收');
    }
  };

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title="灵动岛排队叫号" />

      <ScrollView contentContainerClassName="gap-4 px-4 py-5">
        <View className="gap-2">
          <Text
            size="xl"
            weight="semibold"
          >
            门诊排队的 Live Activity
          </Text>

          <Text
            color="muted"
            size="sm"
          >
            取号后把号码、前面人数、预计叫号时间推到锁屏和灵动岛；叫到号切成到场倒计时。
            这是灵动岛最典型的用法：一件有明确起止、中途状态会变、用户会反复瞄一眼的事。
          </Text>

          <Text
            color={isSupported ? 'success' : 'warning'}
            size="sm"
          >
            {isSupported
              ? '当前设备支持。灵动岛只有 iPhone 14 Pro 及以上才有，其它机型看锁屏卡片。'
              : '当前设备不支持：需要 iOS 16.2+，且必须是 development build，Expo Go 里没有这个模块。'}
          </Text>
        </View>

        <CellGroup
          inset
          title="操作"
        >
          <Cell
            center
            title="自动叫号"
            subtitle={auto ? `每 ${CALL_INTERVAL / 1000} 秒往前推一位` : '停在当前状态，用下面的按钮手动推'}
            trailing={
              <Button
                size="sm"
                variant="tonal"
                color={auto ? 'primary' : 'muted'}
                onPress={() => setAuto(prev => !prev)}
              >
                {auto ? '开' : '关'}
              </Button>
            }
          />
        </CellGroup>

        <View className="gap-2">
          <Button
            block
            disabled={isRunning}
            onPress={handleStart}
          >
            取号并开始排队
          </Button>

          <View className="flex-row gap-2">
            <Button
              className="flex-1"
              color="secondary"
              disabled={!content || content.stage === 'called'}
              variant="tonal"
              onPress={() => {
                if (content) callNext(content).catch(() => undefined);
              }}
            >
              叫下一位
            </Button>

            <Button
              className="flex-1"
              color="warning"
              disabled={!content || content.stage === 'called'}
              variant="tonal"
              onPress={() => {
                update({ aheadCount: 1, stage: 'upcoming' }).catch(() => undefined);
              }}
            >
              快进到剩 1 位
            </Button>
          </View>

          <Button
            block
            color="destructive"
            disabled={!isRunning}
            variant="outline"
            onPress={handleFinish}
          >
            就诊完成，结束活动
          </Button>
        </View>

        {content ? (
          <CellGroup
            inset
            title="卡片当前内容"
          >
            <Cell
              title="号码"
              trailing={content.ticketNumber}
            />
            <Cell
              title="科室"
              trailing={`${content.department} · ${content.doctor}`}
            />
            <Cell
              title="阶段"
              trailing={STAGE_LABEL[content.stage]}
            />
            <Cell
              title="前面还有"
              trailing={`${content.aheadCount} 位`}
            />
            <Cell
              title={content.stage === 'called' ? '到场截止' : '预计叫号'}
              trailing={new Date(content.deadlineAt ?? content.estimatedAt).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            />
          </CellGroup>
        ) : null}

        {!content && isRunning ? (
          <CellGroup
            inset
            title="卡片当前内容"
          >
            <Cell
              center
              title="活动是冷启动恢复出来的"
              subtitle="拿得到实例引用，拿不到历史内容。真实项目在这里向后端查一次排队状态再 update 一遍对齐。"
            />
          </CellGroup>
        ) : null}

        <CellGroup
          inset
          title="推送 token"
        >
          <Cell
            center
            title="本条活动 token"
            subtitle={
              pushToken
                ? `${pushToken.slice(0, 24)}…（交给后端就能远程更新这张卡片）`
                : '未签发。需要在 app.config.ts 里打开 enablePushNotifications，并且用带推送能力的证书签名'
            }
          />
          <Cell
            center
            title="push-to-start token"
            subtitle={
              pushToStartToken
                ? `${pushToStartToken.slice(0, 24)}…（App 没开也能把卡片推起来，iOS 17.2+）`
                : '未签发。同上，另外要求 iOS 17.2+'
            }
          />
        </CellGroup>

        <View className="gap-2 rounded-2xl bg-muted/40 p-4">
          <Text
            size="sm"
            weight="semibold"
          >
            上生产前要知道的
          </Text>

          <Text
            color="muted"
            size="xs"
          >
            · 前台 update 只是兜底，用户锁屏后 App 会被挂起，真正让卡片动起来的是后端拿 pushToken 推 APNs{'\n'}·
            一条活动最多活 8 小时，超过 12 小时系统强制结束，长流程要分段重开{'\n'}· content state 序列化后不能超过
            4KB，别把整个订单塞进去{'\n'}· widget 进程不能发网络请求，头像之类的图片要先下到 App Group 目录里再引用
            {'\n'}· 用户可以在系统设置里单独关掉本 App 的实时活动，start 会直接失败，必须有降级路径
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
