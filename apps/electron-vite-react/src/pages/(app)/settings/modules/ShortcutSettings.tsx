import { Button, useWatch } from '@skyroc/web-ui';
import type { FormInstance } from '@skyroc/web-ui';
import { DEFAULT_SHORTCUTS, SHORTCUT_DEFINITIONS } from './settings-config';
import { SettingRow, SettingsGroup } from './SettingsCard';
import type { DesktopSettings, ShortcutId } from './types';

interface ShortcutSettingsProps {
  /** 当前正在录入的快捷键。 */
  editingShortcut: ShortcutId | null;
  /** 设置表单实例。 */
  form: FormInstance<DesktopSettings>;
  /** 开始录入指定快捷键。 */
  onEdit: (shortcutId: ShortcutId) => void;
  /** 恢复默认快捷键。 */
  onReset: () => void;
  /** 当前快捷键冲突提示。 */
  shortcutConflict: string;
}

const ShortcutSettings = (props: ShortcutSettingsProps) => {
  const { editingShortcut, form, onEdit, onReset, shortcutConflict } = props;

  const shortcuts = useWatch('shortcuts', { form });

  return (
    <SettingsGroup
      description="点击快捷键后直接输入新组合，冲突会在保存前提示。"
      icon="lucide:command"
      title="键盘快捷键"
    >
      <div className="divide-y divide-border">
        {SHORTCUT_DEFINITIONS.map(shortcut => (
          <SettingRow
            description={shortcut.description}
            key={shortcut.id}
            title={shortcut.label}
          >
            <button
              className={`min-w-28 rounded-xl border px-3 py-2 font-mono text-[11px] transition ${
                editingShortcut === shortcut.id
                  ? 'border-primary bg-primary/10 text-primary ring-3 ring-primary/10'
                  : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              data-testid={`shortcut-${shortcut.id}`}
              onClick={() => onEdit(shortcut.id)}
              type="button"
            >
              {editingShortcut === shortcut.id
                ? '请按下组合键…'
                : (shortcuts?.[shortcut.id] ?? DEFAULT_SHORTCUTS[shortcut.id])}
            </button>
          </SettingRow>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-border bg-muted/60 px-5 py-3">
        <div className={`text-[10px] ${shortcutConflict ? 'text-destructive' : 'text-muted-foreground'}`}>
          {shortcutConflict || '修改后的快捷键仅在应用聚焦时生效。'}
        </div>
        <Button
          className="rounded-lg border-border bg-background/60 text-[10px] text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
          onClick={onReset}
          size="sm"
          type="button"
          variant="outline"
        >
          恢复默认值
        </Button>
      </div>
    </SettingsGroup>
  );
};

export default ShortcutSettings;
