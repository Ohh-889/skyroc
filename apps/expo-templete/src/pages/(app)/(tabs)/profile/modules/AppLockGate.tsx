import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, Text } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { BiometricKind } from '@/feature/auth';

const Icon = withUniwind(MaterialCommunityIcons);

/** AppLockGate 组件属性 */
export interface AppLockGateProps {
  /** 正在弹系统验证框 */
  busy: boolean;

  /** 面容还是指纹，决定图标和文案 */
  kind: BiometricKind;

  /** `locked` 是等用户验证；`obscured` 只是 App 切到后台时的一层挡板，不放任何按钮—— 多任务切换器拍的那张缩略图就是这一帧 */
  mode: 'locked' | 'obscured';

  onAuthenticate: () => void;

  onSignOut: () => void;
}

const KIND_LABELS: Record<BiometricKind, string> = {
  face: '面容',
  fingerprint: '指纹',
  none: '身份'
};

const KIND_ICONS: Record<BiometricKind, 'face-recognition' | 'fingerprint' | 'lock-outline'> = {
  face: 'face-recognition',
  fingerprint: 'fingerprint',
  none: 'lock-outline'
};

/**
 * 应用锁的遮罩。
 *
 * 用绝对定位盖在页面上，而不是 `router.replace` 到一个 /lock 路由：锁是**页面的一个状态**， 不是一个位置。走路由的话，返回栈、tab 选中态、深链落点全都要为这个临时状态让路，
 * 用户解锁后还得想办法「回到刚才那里」。
 *
 * 底下的内容照常渲染。遮罩是不透明的，截屏和多任务缩略图拿到的都是这一层。
 */
export const AppLockGate = (props: AppLockGateProps) => {
  const { busy, kind, mode, onAuthenticate, onSignOut } = props;

  return (
    <View className="absolute inset-0 z-10 items-center justify-center gap-6 bg-background px-10">
      {mode === 'obscured' ? null : (
        <>
          <View className="size-20 items-center justify-center rounded-full bg-muted">
            <Icon
              colorClassName="accent-muted-foreground"
              name={KIND_ICONS[kind]}
              size={36}
            />
          </View>

          <View className="items-center gap-2">
            <Text
              size="xl"
              weight="semibold"
            >
              已锁定
            </Text>

            <Text
              className="text-center"
              color="muted"
              size="sm"
            >
              {`验证${KIND_LABELS[kind]}后查看「我的」`}
            </Text>
          </View>

          <View className="w-full gap-2">
            <Button
              block
              loading={busy}
              onPress={onAuthenticate}
            >
              验证身份
            </Button>

            {/* 兜底出口。传感器坏了、系统把生物识别锁死了都可能验不过，
                不留这条路的话用户只能卸载重装 */}
            <Button
              block
              color="muted"
              variant="ghost"
              onPress={onSignOut}
            >
              退出登录
            </Button>
          </View>
        </>
      )}
    </View>
  );
};
