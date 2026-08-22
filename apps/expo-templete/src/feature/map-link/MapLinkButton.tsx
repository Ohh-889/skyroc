import { Button } from '@skyroc/native-ui';
import type { ButtonProps } from '@skyroc/native-ui';

import { openMapLink } from './open-map-link';
import type { OpenMapLinkOptions } from './open-map-link';
import type { MapProviderId, MapTarget } from './types';

/** MapLinkButton 组件属性 */
export interface MapLinkButtonProps extends Omit<ButtonProps, 'onPress'>, OpenMapLinkOptions {
  /** 面板结算后的回调，拿到实际被调起的地图 id；取消或失败时为 null */
  onOpened?: (provider: MapProviderId | null) => void;

  /** 导航目的地 */
  target: MapTarget;
}

/** 点一下就弹出地图选择面板的按钮，样式与交互都走 Button，这里只负责接上 openMapLink */
export const MapLinkButton = (props: MapLinkButtonProps) => {
  const { cancelText, children = '导航到这里', mode, onOpened, target, title, ...buttonProps } = props;

  const handlePress = async () => {
    onOpened?.(await openMapLink(target, { cancelText, mode, title }));
  };

  return (
    <Button
      {...buttonProps}
      onPress={handlePress}
    >
      {children}
    </Button>
  );
};
