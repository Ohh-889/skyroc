import { FormControl, Segment, Select, Switch } from '@skyroc/web-ui';
import { SettingRow, SettingsGroup } from './SettingsCard';
import type { DesktopSettings } from './types';

const AccessibilityAppearanceSettings = () => {
  return (
    <>
      <SettingsGroup
        description="提高文字、状态、焦点和颜色辨识度。"
        icon="lucide:accessibility"
        title="辅助显示"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="增强文字、边框和禁用状态的明暗差异。"
            title="对比度"
          >
            <FormControl<DesktopSettings>
              name="contrastMode"
              trigger="onValueChange"
            >
              <Segment
                classNames={{
                  indicator: 'bg-primary/10',
                  list: 'rounded-xl border border-border bg-muted p-1',
                  trigger: 'min-w-18 rounded-lg px-3 py-1.5 text-[11px]'
                }}
                items={[
                  { label: '标准', value: 'standard' },
                  { label: '高对比', value: 'high' },
                  { label: '跟随系统', value: 'system' }
                ]}
              />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="为红色弱、绿色弱或蓝色弱提供全窗口颜色映射。"
            title="色觉辅助"
          >
            <FormControl<DesktopSettings>
              name="colorVisionMode"
              trigger="onValueChange"
            >
              <Select
                classNames={{ trigger: 'w-44 rounded-xl border-border bg-muted text-[11px] shadow-none' }}
                items={[
                  { label: '关闭', value: 'none' },
                  { label: '红色弱辅助', value: 'protan' },
                  { label: '绿色弱辅助', value: 'deutan' },
                  { label: '蓝色弱辅助', value: 'tritan' }
                ]}
              />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="临时移除色彩，检查信息是否过度依赖颜色表达。"
            title="灰度模式"
          >
            <FormControl<DesktopSettings>
              name="grayscale"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="灰度模式" />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="为键盘操作显示更粗、更高对比度的焦点环。"
            title="焦点轮廓增强"
          >
            <FormControl<DesktopSettings>
              name="enhancedFocus"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="焦点轮廓增强" />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="正文链接始终带下划线，避免只依靠颜色识别。"
            title="链接下划线"
          >
            <FormControl<DesktopSettings>
              name="underlineLinks"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="链接下划线" />
            </FormControl>
          </SettingRow>
        </div>
      </SettingsGroup>

      <SettingsGroup
        description="减少位移、闪烁、模糊以及非必要的视觉干扰。"
        icon="lucide:wand-sparkles"
        title="动画与视觉效果"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="减少模式取消位移和循环动画；关闭模式同时取消过渡。"
            title="界面动效"
          >
            <FormControl<DesktopSettings>
              name="motionMode"
              trigger="onValueChange"
            >
              <Select
                classNames={{ trigger: 'w-44 rounded-xl border-border bg-muted text-[11px] shadow-none' }}
                items={[
                  { label: '跟随系统', value: 'system' },
                  { label: '完整动效', value: 'full' },
                  { label: '减少动效', value: 'reduced' },
                  { label: '关闭动效', value: 'none' }
                ]}
              />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="停止装饰性循环动画，并将闪烁效果限制为一次。"
            title="减少闪烁"
          >
            <FormControl<DesktopSettings>
              name="reduceFlashing"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="减少闪烁" />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="关闭半透明表面和背景模糊，同时覆盖窗口材质。"
            title="减少透明效果"
          >
            <FormControl<DesktopSettings>
              name="reduceTransparency"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="减少透明效果" />
            </FormControl>
          </SettingRow>
        </div>
      </SettingsGroup>
    </>
  );
};

export default AccessibilityAppearanceSettings;
