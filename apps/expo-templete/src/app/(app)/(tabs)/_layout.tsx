import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useCSSVariable } from 'uniwind';

import { useUnreadCountQuery } from '@/feature/demo';

/** 角标封顶。原生 tab bar 的角标宽度有限，三位数会把 label 挤变形 */
const MAX_BADGE_COUNT = 99;

/** UseCSSVariable 在原生端可能返回数字（`16px` 会变成 `16`），颜色变量拿不到时回落成 undefined，交给系统默认色，而不是把一个数字塞进 ColorValue。 */
function toColor(value: number | string | undefined) {
  return typeof value === 'string' ? value : undefined;
}

/**
 * 底部四个 tab：首页 / 发现 / 消息 / 我的。
 *
 * 图标同时给 `sf` 和 `src`：iOS 用 SF Symbol（选中态自动换成 fill 版，和系统 App 观感一致）， Android 走 `src` 里的矢量图标。两端各用各的图标源，省掉维护两套 @2x/@3x 位图。
 *
 * 颜色一律从 uniwind 的 CSS 变量取，不要另写一份色表——切主题时 tab bar 才会跟着变。
 *
 * 内容区的底部内边距不用页面自己算，但**每个 tab 页的滚动容器必须套一层 `ScrollViewMarker`** （`react-native-screens/experimental`）并带上
 * `contentInsetAdjustmentBehavior="automatic"`。 少了它，iOS 上内容底部会被 tab bar 整块盖住，tab bar 也会一直停在透明的 scrollEdgeAppearance 上，
 * 看着就是一条死色带。原因写在各页 `ScrollViewMarker` 上方的注释里。
 */
const TabsLayout = () => {
  // 角标数直接读 query。它是服务端状态，不进全局 store：消息页标记已读后 invalidate 同一个 key，
  // 这里就跟着重渲染，两个页面之间不需要任何通信
  const { data: unreadCount = 0 } = useUnreadCountQuery();

  const [background, primary, mutedForeground] = useCSSVariable(['--background', '--primary', '--muted-foreground']);

  const activeColor = toColor(primary);

  const inactiveColor = toColor(mutedForeground);

  const badgeValue = unreadCount > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(unreadCount);

  return (
    <NativeTabs
      backgroundColor={toColor(background)}
      iconColor={{ default: inactiveColor, selected: activeColor }}
      indicatorColor={activeColor}
      labelStyle={{ default: { color: inactiveColor }, selected: { color: activeColor } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>首页</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          src={
            <NativeTabs.Trigger.VectorIcon
              family={MaterialCommunityIcons}
              name="home-outline"
            />
          }
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>发现</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }}
          src={
            <NativeTabs.Trigger.VectorIcon
              family={MaterialCommunityIcons}
              name="view-grid-outline"
            />
          }
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="messages">
        <NativeTabs.Trigger.Label>消息</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bell', selected: 'bell.fill' }}
          src={
            <NativeTabs.Trigger.VectorIcon
              family={MaterialCommunityIcons}
              name="bell-outline"
            />
          }
        />
        {/* Badge 的 children 只接受 string，且 hidden 才是「不显示」——传空串在两端表现不一致 */}
        <NativeTabs.Trigger.Badge hidden={unreadCount === 0}>{badgeValue}</NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>我的</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          src={
            <NativeTabs.Trigger.VectorIcon
              family={MaterialCommunityIcons}
              name="account-outline"
            />
          }
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;
