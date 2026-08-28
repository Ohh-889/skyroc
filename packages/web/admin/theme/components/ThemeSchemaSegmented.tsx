import { SvgIcon } from '@shell/ui/compose';
import type { SegmentedOptions } from 'antd/es/segmented';
import Segmented from 'antd/es/segmented';
import { useTheme } from '../hooks/use-theme';
import { icons } from './shared';

const ThemeMode = ['auto', 'dark', 'light'] satisfies Theme.ThemeMode[];

const OPTIONS = Object.values(ThemeMode).map(item => {
  const key = item;
  return {
    label: (
      <div className="w-[70px] flex justify-center">
        <SvgIcon
          className="text-icon-small h-28px"
          icon={icons[key]}
        />
      </div>
    ),
    value: item
  };
}) satisfies SegmentedOptions;

const ThemeSchemaSegmented = () => {
  const { setThemeScheme, themeScheme } = useTheme();

  return (
    <Segmented
      className="bg-layout"
      options={OPTIONS}
      value={themeScheme}
      onChange={setThemeScheme}
    />
  );
};

export default ThemeSchemaSegmented;
