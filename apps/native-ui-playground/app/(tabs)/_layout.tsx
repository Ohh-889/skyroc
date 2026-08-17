import { NativeTabs } from 'expo-router/unstable-native-tabs';

const TabLayout = () => {
  return (
    <NativeTabs
      blurEffect="systemUltraThinMaterial"
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          md="widgets"
          sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }}
        />
        <NativeTabs.Trigger.Label>组件</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Icon
          md="palette"
          sf={{ default: 'paintpalette', selected: 'paintpalette.fill' }}
        />
        <NativeTabs.Trigger.Label>基础</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="patterns">
        <NativeTabs.Trigger.Icon
          md="layers"
          sf={{ default: 'square.stack.3d.up', selected: 'square.stack.3d.up.fill' }}
        />
        <NativeTabs.Trigger.Label>场景</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          md="person"
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
        />
        <NativeTabs.Trigger.Label>我的</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabLayout;
