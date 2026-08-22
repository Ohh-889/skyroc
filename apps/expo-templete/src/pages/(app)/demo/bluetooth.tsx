import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  Cell,
  CellGroup,
  Tag,
  Text,
  showConfirmDialog,
  showFailToast,
  showSuccessToast,
  showToast
} from '@skyroc/native-ui';
import type { TagColor } from '@skyroc/native-ui';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Platform, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { BluetoothPermission, BluetoothPermissionStatus, BluetoothState } from '@skyroc/expo-bluetooth';
import {
  addBluetoothStateListener,
  ensureBluetoothReady,
  getBluetoothPermission,
  getBluetoothState,
  isLocationServicesEnabled,
  openAppSettings,
  openLocationSettings,
  requestBluetoothPermission,
  requestEnableBluetooth
} from '@skyroc/expo-bluetooth';
import { DemoHeader } from './modules/DemoHeader';

const Icon = withUniwind(MaterialCommunityIcons);

/**
 * 系统定位服务只对 Android 有意义（12 以下 BLE 扫描要求它开着）。
 *
 * IOS 上模块把它兜成恒 true / 恒 false，是为了让调用代码不用到处写 Platform.OS； 但 UI 上再摆一行永远为真的状态就是噪音，所以这里整块不渲染。
 */
const IS_ANDROID = Platform.OS === 'android';

/** 八种状态的展示文案与配色，穷举写死是为了漏掉新状态时 TS 直接报错 */
const STATE_META: Record<BluetoothState, { color: TagColor; label: string }> = {
  off: { color: 'warning', label: '已关闭' },
  on: { color: 'success', label: '已开启' },
  resetting: { color: 'info', label: '系统重启蓝牙栈中' },
  turningOff: { color: 'warning', label: '关闭中' },
  turningOn: { color: 'info', label: '开启中' },
  unauthorized: { color: 'destructive', label: '未授权' },
  unknown: { color: 'muted', label: '未知' },
  unsupported: { color: 'destructive', label: '不支持' }
};

const PERMISSION_META: Record<BluetoothPermissionStatus, { color: TagColor; label: string }> = {
  denied: { color: 'destructive', label: '已拒绝' },
  granted: { color: 'success', label: '已授权' },
  undetermined: { color: 'muted', label: '未询问' }
};

const BluetoothDemoScreen = () => {
  const [state, setState] = useState<BluetoothState | null>(null);
  const [permission, setPermission] = useState<BluetoothPermission | null>(null);
  const [locationServices, setLocationServices] = useState<boolean | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  /** 三个查询都不弹窗，可以随便刷 */
  const refresh = useCallback(async () => {
    const [nextState, nextPermission, nextLocation] = await Promise.all([
      getBluetoothState(),
      getBluetoothPermission(),
      isLocationServicesEnabled()
    ]);

    setState(nextState);
    setPermission(nextPermission);
    setLocationServices(nextLocation);
  }, []);

  /** 每个动作跑完都刷一次面板，按钮上的 loading 也由这里统一管 */
  const run = useCallback(
    async (action: string, task: () => Promise<void>) => {
      setBusy(action);

      try {
        await task();
      } catch (error) {
        // 模块本身不会 reject，兜到这里说明是真正的 JS 异常
        showFailToast(error instanceof Error ? error.message : String(error));
      }

      await refresh();
      setBusy(null);
    },
    [refresh]
  );

  /** 权限没了只剩设置页这一条路时的统一出口 */
  const confirmOpenSettings = useCallback(async (message: string) => {
    const action = await showConfirmDialog({
      confirmButtonText: '去设置',
      message,
      title: '需要蓝牙权限'
    });

    if (action === 'confirm') await openAppSettings();
  }, []);

  const handleQueryState = () =>
    run('getBluetoothState', async () => {
      const next = await getBluetoothState();

      showToast(`蓝牙状态：${STATE_META[next].label}（${next}）`);
    });

  const handleRequestPermission = () =>
    run('requestBluetoothPermission', async () => {
      const next = await requestBluetoothPermission();

      if (next.granted) {
        showSuccessToast('已授权');
        return;
      }

      if (next.canAskAgain) {
        showFailToast('用户拒绝了，还可以再申请一次');
        return;
      }

      await confirmOpenSettings('系统不会再弹权限弹窗了，只能到 App 设置页里手动打开蓝牙权限。');
    });

  const handleRequestEnable = () =>
    run('requestEnableBluetooth', async () => {
      const result = await requestEnableBluetooth();

      if (!result.ok) {
        if (result.code === 'ERR_BLUETOOTH_USER_CANCELLED') {
          // 用户主动放弃是正常分支，轻提示就够，别当错误弹
          showToast('已取消');
          return;
        }

        if (result.code === 'ERR_BLUETOOTH_PERMISSION_DENIED') {
          await confirmOpenSettings('没有蓝牙权限就调不起系统的开关对话框。');
          return;
        }

        showFailToast(`${result.code} · ${result.message}`);
        return;
      }

      // ok 不等于蓝牙已经开了，两端的落地方式看 handledBy
      switch (result.payload.handledBy) {
        case 'alreadyEnabled':
          showToast('蓝牙本来就是开着的');
          break;
        case 'dialog':
          showSuccessToast('蓝牙已打开');
          break;
        default:
          showToast('已跳到系统设置页，打开蓝牙后切回来会自动刷新');
      }
    });

  const handleEnsureReady = () =>
    run('ensureBluetoothReady', async () => {
      const outcome = await ensureBluetoothReady();

      if (outcome.ready) {
        showSuccessToast('蓝牙已就绪，可以去扫描 / 连接设备了');
        return;
      }

      switch (outcome.blockedBy) {
        case 'unsupported':
          showFailToast('本机没有蓝牙硬件，模拟器上就是这个结果');
          break;

        case 'permission':
          await confirmOpenSettings('权限被拒绝了。系统不再弹窗时，只能到 App 设置页里手动打开。');
          break;

        case 'bluetoothOff':
          showToast(IS_ANDROID ? '蓝牙没开，刚才弹过系统开关对话框' : '蓝牙没开，已跳到设置页，打开后切回来会自动刷新');
          break;

        case 'locationServicesOff': {
          const action = await showConfirmDialog({
            confirmButtonText: '去打开',
            message: 'Android 12 以下做 BLE 扫描要求系统定位服务开着，关着的话扫描不报错但一个设备都扫不到。',
            title: '定位服务没开'
          });

          if (action === 'confirm') await openLocationSettings();
          break;
        }

        default:
          break;
      }
    });

  const handleOpenLocationSettings = () =>
    run('openLocationSettings', async () => {
      const opened = await openLocationSettings();

      // 成功跳转时页面已经切走了，没必要再提示
      if (!opened) showFailToast('打不开系统定位设置页');
    });

  const handleOpenAppSettings = () =>
    run('openAppSettings', async () => {
      const opened = await openAppSettings();

      if (!opened) showFailToast('打不开 App 设置页');
    });

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 开关状态变化。iOS 上要等用户授权之后才收得到事件——没授权就建不了 CBCentralManager
  useEffect(() => {
    const subscription = addBluetoothStateListener(event => {
      setState(event.state);
      showToast(`收到状态变化事件：${STATE_META[event.state].label}`);
    });

    return () => subscription.remove();
  }, []);

  // iOS 的 requestEnableBluetooth 只是跳到设置页，用户在那边开完切回来时得自己复查
  useEffect(() => {
    const subscription = AppState.addEventListener('change', status => {
      if (status === 'active') refresh();
    });

    return () => subscription.remove();
  }, [refresh]);

  const stateMeta = state ? STATE_META[state] : null;
  const permissionMeta = permission ? PERMISSION_META[permission.status] : null;

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title="蓝牙能力测试" />

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-4 px-4 py-5"
      >
        <View className="gap-2">
          <Text
            size="xl"
            weight="semibold"
          >
            蓝牙可用性检查
          </Text>

          <Text
            color="muted"
            size="sm"
          >
            @skyroc/expo-bluetooth 只管「现在能不能用蓝牙」：状态、权限、引导开启，不含扫描与连接。 模拟器上一律是
            unsupported，要在真机上测。
          </Text>
        </View>

        <CellGroup
          inset
          title="当前状态"
        >
          <Cell
            center
            title="蓝牙状态"
            subtitle={
              <Text
                color="muted"
                size="xs"
              >
                {state ?? '查询中…'}
              </Text>
            }
            leading={
              <View className="size-9 items-center justify-center rounded-xl bg-primary/10">
                <Icon
                  colorClassName="accent-primary"
                  size={20}
                  name={state === 'on' ? 'bluetooth' : 'bluetooth-off'}
                />
              </View>
            }
            trailing={
              stateMeta ? (
                <Tag
                  color={stateMeta.color}
                  variant="tonal"
                >
                  {stateMeta.label}
                </Tag>
              ) : null
            }
          />

          <Cell
            center
            title="蓝牙权限"
            leading={
              <View className="size-9 items-center justify-center rounded-xl bg-primary/10">
                <Icon
                  colorClassName="accent-primary"
                  name="shield-key-outline"
                  size={20}
                />
              </View>
            }
            subtitle={
              <Text
                color="muted"
                size="xs"
              >
                {permission
                  ? `canAskAgain: ${permission.canAskAgain}${
                      permission.canAskAgain ? '' : ' · 系统不会再弹，只能去设置页'
                    }`
                  : '查询中…'}
              </Text>
            }
            trailing={
              permissionMeta ? (
                <Tag
                  color={permissionMeta.color}
                  variant="tonal"
                >
                  {permissionMeta.label}
                </Tag>
              ) : null
            }
          />

          {IS_ANDROID ? (
            <Cell
              center
              title="系统定位服务"
              leading={
                <View className="size-9 items-center justify-center rounded-xl bg-primary/10">
                  <Icon
                    colorClassName="accent-primary"
                    name="map-marker-radius-outline"
                    size={20}
                  />
                </View>
              }
              subtitle={
                <Text
                  color="muted"
                  size="xs"
                >
                  Android 12 以下扫描要求它开着，关着会扫不到任何设备且不报错
                </Text>
              }
              trailing={
                locationServices === null ? null : (
                  <Tag
                    color={locationServices ? 'success' : 'warning'}
                    variant="tonal"
                  >
                    {locationServices ? '已开启' : '已关闭'}
                  </Tag>
                )
              }
            />
          ) : null}
        </CellGroup>

        <View className="gap-2">
          <Text
            size="sm"
            weight="medium"
          >
            一键走完前置流程
          </Text>

          <Button
            block
            disabled={busy !== null}
            loading={busy === 'ensureBluetoothReady'}
            onPress={handleEnsureReady}
          >
            ensureBluetoothReady()
          </Button>

          <Text
            color="muted"
            size="xs"
          >
            按权限 → 开关 →{IS_ANDROID ? ' 定位服务 →' : ''} 的顺序依次检查，卡住时用 blockedBy
            告诉你差哪一步，这里直接翻成对应的弹窗。
          </Text>
        </View>

        <View className="gap-2">
          <Text
            size="sm"
            weight="medium"
          >
            原子方法
          </Text>

          <View className="flex-row flex-wrap gap-2">
            <Button
              disabled={busy !== null}
              loading={busy === 'getBluetoothState'}
              size="sm"
              variant="outline"
              onPress={handleQueryState}
            >
              查状态
            </Button>

            <Button
              disabled={busy !== null}
              loading={busy === 'requestBluetoothPermission'}
              size="sm"
              variant="outline"
              onPress={handleRequestPermission}
            >
              申请权限
            </Button>

            <Button
              disabled={busy !== null}
              loading={busy === 'requestEnableBluetooth'}
              size="sm"
              variant="outline"
              onPress={handleRequestEnable}
            >
              请求开启蓝牙
            </Button>

            {IS_ANDROID ? (
              <Button
                disabled={busy !== null}
                loading={busy === 'openLocationSettings'}
                size="sm"
                variant="outline"
                onPress={handleOpenLocationSettings}
              >
                打开定位设置
              </Button>
            ) : null}

            <Button
              disabled={busy !== null}
              loading={busy === 'openAppSettings'}
              size="sm"
              variant="outline"
              onPress={handleOpenAppSettings}
            >
              打开 App 设置
            </Button>
          </View>

          <Text
            color="muted"
            size="xs"
          >
            {IS_ANDROID
              ? '「请求开启蓝牙」会弹系统开关对话框并等你选完才返回，enabled 就是你的真实选择。'
              : '查状态不会弹权限弹窗，没问过权限时返回 unknown——先「申请权限」才拿得到确定值。「请求开启蓝牙」只能跳到 App 设置页，返回的 enabled 恒为 false。'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default BluetoothDemoScreen;
