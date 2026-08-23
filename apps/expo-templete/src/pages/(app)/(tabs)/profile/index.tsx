import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Avatar,
  Button,
  Cell,
  CellGroup,
  Switch,
  Text,
  showActionSheet,
  showConfirmDialog,
  showSuccessToast
} from '@skyroc/native-ui';
import { useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { withUniwind } from 'uniwind';

import type { BiometricKind } from '@/feature/auth';
import { useAppLock, useSession } from '@/feature/auth';
import type { ProfileStatKey } from '@/feature/demo';
import { useProfileQuery } from '@/feature/demo';
import { THEME_MODES, useThemeMode } from '@/feature/theme';
import type { ThemeMode } from '@/feature/theme';
import { API_BASE_URL } from '@/service/config';

import { TabHeader } from '../modules/TabHeader';
import { AppLockGate } from './modules/AppLockGate';

const Icon = withUniwind(MaterialCommunityIcons);

/** ScrollViewMarker 是原生视图，不吃 className，只能给 style */
const FILL = { flex: 1 } as const;

const MODE_LABELS: Record<ThemeMode, string> = {
  dark: '深色',
  light: '浅色',
  system: '跟随系统'
};

/** 应用锁那一行的文案跟着设备能力走：有面容就说面容，只有指纹就说指纹 */
const LOCK_LABELS: Record<BiometricKind, string> = {
  face: '面容解锁',
  fingerprint: '指纹解锁',
  none: '生物识别解锁'
};

/** 统计项的顺序由接口决定，这里只管每一项显示成什么样 */
const STAT_LABELS: Record<ProfileStatKey, string> = {
  collection: '收藏',
  coupon: '优惠券',
  footprint: '足迹'
};

/** 应用版本。取 app.config.ts 里的 `version`，不是 package.json 的 */
const APP_VERSION = Constants.expoConfig?.version ?? '-';

/** 构建标识。dev / staging 的应用名带后缀，一眼能看出手机上装的是哪个包 */
const APP_LABEL = Constants.expoConfig?.name ?? '-';

/**
 * 「我的」tab。
 *
 * 把散落在各处的全局开关收在一页：主题偏好、缓存、登出。它们的共同点是**改一下影响整个 App**， 所以入口不该藏在某个业务二级页里。
 *
 * 这一页几乎不请求数据，唯一的 `useProfileQuery` 也只是拿头像和昵称——真实项目里它通常来自 `/user/me`，登出时被 `queryClient.clear()` 一并清掉，下一个账号才不会看到上一个账号的名字。
 */
const ProfileScreen = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { signOut } = useSession();

  const { data } = useProfileQuery();

  const { mode, setMode } = useThemeMode();

  // 这一页是模板里唯一上锁的地方。要保护整个 (app)，把同一个 hook 挪到根 layout 即可，
  // 规则不用改——它本来就是按进程和前后台算的，和挂在哪一层无关
  const lock = useAppLock();

  // 纯 UI 演示。真实项目里这个开关要和系统通知权限对齐：用户在系统设置里关掉推送之后，
  // App 内还亮着的开关就是在骗人
  const [notifyEnabled, setNotifyEnabled] = useState(true);

  async function handleThemePress() {
    const result = await showActionSheet({
      cancelText: '取消',
      defaultValue: mode,
      title: '外观',
      actions: THEME_MODES.map(item => ({ name: MODE_LABELS[item], value: item }))
    });

    if (result) setMode(result.action.value as ThemeMode);
  }

  async function handleClearCache() {
    const action = await showConfirmDialog({
      message: '会清掉已缓存的接口数据，下次进页面重新拉取。不影响登录状态。',
      title: '清除缓存'
    });

    if (action !== 'confirm') return;

    queryClient.clear();

    showSuccessToast('缓存已清除');
  }

  async function handleSignOut() {
    const action = await showConfirmDialog({
      confirmButtonText: '退出',
      message: '退出后需要重新登录才能继续使用。',
      title: '退出登录'
    });

    // signOut 会清凭据 + queryClient.clear()，根 layout 的 Stack.Protected 随即把人踢回 (auth)/login。
    // 少了 clear 那一步，下一个账号会先看到上一个账号的数据
    if (action === 'confirm') signOut();
  }

  return (
    <View className="flex-1 bg-background">
      <TabHeader title="我的" />

      <ScrollViewMarker style={FILL}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 pb-6"
          contentInsetAdjustmentBehavior="automatic"
        >
          <Pressable
            accessibilityRole="button"
            className="mx-4 flex-row items-center gap-3 rounded-2xl bg-card p-4 active:opacity-70"
            onPress={() => showSuccessToast('编辑资料：换成自己的页面')}
          >
            <Avatar
              size="lg"
              fallback={data ? data.name.slice(-2) : ''}
            />

            <View className="flex-1 gap-0.5">
              <Text
                size="lg"
                weight="semibold"
              >
                {data?.name ?? '加载中'}
              </Text>

              <Text
                color="muted"
                size="sm"
              >
                {data ? `${data.department} · ${data.title}` : ' '}
              </Text>

              <Text
                color="muted"
                size="xs"
              >
                {data?.phone ?? ' '}
              </Text>
            </View>

            <Icon
              colorClassName="accent-muted-foreground"
              name="chevron-right"
              size={20}
            />
          </Pressable>

          <View className="mx-4 flex-row rounded-2xl bg-card py-3">
            {(data?.stats ?? []).map((stat, index) => (
              <View
                key={stat.key}
                className={`flex-1 items-center gap-0.5 ${index > 0 ? 'border-l border-border/60' : ''}`}
              >
                <Text
                  size="lg"
                  weight="semibold"
                >
                  {stat.value}
                </Text>

                <Text
                  color="muted"
                  size="xs"
                >
                  {STAT_LABELS[stat.key]}
                </Text>
              </View>
            ))}
          </View>

          <CellGroup
            border
            inset
            title="通用"
          >
            <Cell
              showArrow
              title="外观"
              trailing={MODE_LABELS[mode]}
              onPress={handleThemePress}
              leading={
                <Icon
                  colorClassName="accent-foreground"
                  name="palette-outline"
                  size={20}
                />
              }
            />

            <Cell
              title="消息通知"
              leading={
                <Icon
                  colorClassName="accent-foreground"
                  name="bell-outline"
                  size={20}
                />
              }
              trailing={
                <Switch
                  checked={notifyEnabled}
                  onCheckedChange={setNotifyEnabled}
                />
              }
            />

            <Cell
              subtitle={lock.available ? undefined : '本机未录入面容或指纹'}
              title={LOCK_LABELS[lock.kind]}
              leading={
                <Icon
                  colorClassName="accent-foreground"
                  name="lock-outline"
                  size={20}
                />
              }
              trailing={
                <Switch
                  checked={lock.enabled && lock.available}
                  disabled={!lock.available}
                  onCheckedChange={lock.setEnabled}
                />
              }
            />

            <Cell
              showArrow
              title="清除缓存"
              onPress={handleClearCache}
              leading={
                <Icon
                  colorClassName="accent-foreground"
                  name="broom"
                  size={20}
                />
              }
            />
          </CellGroup>

          <CellGroup
            border
            inset
            title="关于"
          >
            <Cell
              title="版本"
              trailing={APP_VERSION}
            />

            <Cell
              title="构建标识"
              trailing={APP_LABEL}
            />

            {/* 接口地址是编译期打进包里的 EXPO_PUBLIC_*，摆出来纯粹是为了排查「连错环境」 */}
            <Cell
              title="接口地址"
              trailing={API_BASE_URL || '未接后端'}
              classNames={{ trailingText: 'text-xs' }}
            />

            {__DEV__ ? (
              <Cell
                showArrow
                title="路由表"
                trailing="/_sitemap"
                onPress={() => router.push('/_sitemap')}
              />
            ) : null}
          </CellGroup>

          <View className="px-4 pt-2">
            <Button
              block
              color="destructive"
              variant="tonal"
              onPress={handleSignOut}
            >
              退出登录
            </Button>
          </View>
        </ScrollView>
      </ScrollViewMarker>

      {/* 盖在最上层，所以放在最后。isObscured 那一路是 App 切后台时的挡板，见 AppLockGate 的注释 */}
      {lock.isLocked || lock.isObscured ? (
        <AppLockGate
          busy={lock.isAuthenticating}
          kind={lock.kind}
          mode={lock.isLocked ? 'locked' : 'obscured'}
          onAuthenticate={lock.authenticate}
          onSignOut={signOut}
        />
      ) : null}
    </View>
  );
};

export default ProfileScreen;
