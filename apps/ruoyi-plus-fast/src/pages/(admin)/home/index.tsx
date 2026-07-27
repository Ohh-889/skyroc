import { createFileRoute } from '@tanstack/react-router';

const quickStartItems = [
  'Edit src/pages/(admin)/home/index.tsx',
  'Add routes under src/pages/(admin)',
  'Configure runtime API adapters in src/service'
] as const;

const Home = () => {
  const { t } = useTranslation();

  return (
    <ASpace className="w-full" orientation="vertical" size={16}>
      <ACard variant="borderless">
        <ASpace className="w-full" orientation="vertical" size={16}>
          <div>
            <h1 className="m-0 text-28px font-600 text-primary">{t('system.title')}</h1>
            <p className="m-0 mt-8px text-14px text-text-2">A minimal admin starter is ready.</p>
          </div>

          <ARow gutter={[16, 16]}>
            {quickStartItems.map(item => {
              return (
                <ACol key={item} lg={8} span={24}>
                  <div className="rounded-8px bg-layout p-16px text-14px text-text-1">{item}</div>
                </ACol>
              );
            })}
          </ARow>
        </ASpace>
      </ACard>
    </ASpace>
  );
};

export const Route = createFileRoute('/(admin)/home/')({
  component: Home,
  staticData: {
    i18nKey: 'route.home',
    title: 'home',
    menu: {
      icon: 'mdi:monitor-dashboard',
      order: 1
    }
  }
});
