import { Icon } from '@skyroc/web-ui';
import { SETTINGS_SECTIONS } from './settings-config';
import type { SettingsSectionId } from './types';

interface SettingsNavigationProps {
  /** 当前显示的设置分区。 */
  activeSection: SettingsSectionId;
  /** 切换设置分区。 */
  onSectionChange: (section: SettingsSectionId) => void;
}

const SettingsNavigation = (props: SettingsNavigationProps) => {
  const { activeSection, onSectionChange } = props;

  return (
    <aside className="self-start rounded-[22px] border border-border bg-card/60 p-2.5 shadow-sm min-[960px]:sticky min-[960px]:top-6">
      <nav
        aria-label="设置分区"
        className="grid grid-cols-2 gap-1 min-[680px]:grid-cols-3 min-[960px]:grid-cols-1"
      >
        {SETTINGS_SECTIONS.map(section => {
          const isActive = section.id === activeSection;

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              data-testid={`settings-section-${section.id}`}
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              type="button"
            >
              <Icon
                className={isActive ? 'text-primary' : 'text-muted-foreground'}
                height="17"
                icon={section.icon}
                width="17"
              />
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold">{section.label}</span>
                <span className="mt-0.5 hidden truncate text-[9px] text-muted-foreground min-[960px]:block">
                  {section.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
      <div className="mt-2 hidden rounded-xl border border-border bg-muted p-3 min-[960px]:block">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground">
          <Icon
            height="13"
            icon="lucide:hard-drive"
            width="13"
          />
          当前设备
        </div>
        <div className="mt-2 text-[9px] leading-4 text-muted-foreground">macOS · Skyroc 2.4.0</div>
      </div>
    </aside>
  );
};

export default SettingsNavigation;
