// oxlint-disable import/no-unassigned-import
import { LangSwitch } from '@skyroc/web-admin-i18n';
import { ThemeSchemaSwitch, useSettingsTheme } from '@skyroc/web-admin-theme';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

import './style.css';

const LoginSearchSchema = z.object({
  redirect: z.string().startsWith('/').optional()
});

const LoginLayout = () => {
  const { t } = useTranslation();

  const { header } = useSettingsTheme();

  const features = [
    {
      icon: 'ph:shield-check',
      text: t('page.login.enterprise.brandFeaturePermission')
    },
    {
      icon: 'ph:clock',
      text: t('page.login.enterprise.brandFeatureAudit')
    },
    {
      icon: 'ph:shield-warning',
      text: t('page.login.enterprise.brandFeatureSecure')
    }
  ];

  function handleUnavailableAction() {
    showInfoMessage(t('page.login.enterprise.notConfigured'));
  }

  return (
    <main className="skyroc-login-page">
      <div className="skyroc-auth-shell">
        <aside className="skyroc-brand-panel" aria-label={t('system.title')}>
          <div className="skyroc-brand-grid" aria-hidden="true" />
          <div className="skyroc-brand-orbit" aria-hidden="true">
            <span className="skyroc-orbit-dot skyroc-orbit-dot-one" />
            <span className="skyroc-orbit-dot skyroc-orbit-dot-two" />
            <span className="skyroc-orbit-dot skyroc-orbit-dot-three" />
          </div>
          <div className="skyroc-glass-ellipse" aria-hidden="true" />
          <div className="skyroc-glass-cube" aria-hidden="true" />

          <header className="skyroc-brand-header">
            <SystemLogo className="skyroc-brand-logo" />
            <p className="skyroc-brand-name">{t('system.title')}</p>
          </header>

          <section className="skyroc-brand-copy">
            <h1 className="skyroc-brand-title">{t('page.login.enterprise.brandTitle')}</h1>
            <ul className="skyroc-brand-features">
              {features.map(item => (
                <li className="skyroc-brand-feature" key={item.icon}>
                  <SvgIcon icon={item.icon} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <section className="skyroc-login-panel">
          <div className="skyroc-login-actions">
            <ThemeSchemaSwitch
              className="skyroc-login-action-button"
              tooltipContent={t('icon.themeSchema')}
              tooltipPlacement="bottom"
            />
            <LangSwitch className="skyroc-login-action-button" visible={header.multilingual.visible} />
          </div>

          <div className="skyroc-auth-content">
            <Outlet />

            <footer className="skyroc-auth-footer">
              <button type="button" onClick={handleUnavailableAction}>
                {t('page.login.enterprise.privacy')}
              </button>
              <span>·</span>
              <button type="button" onClick={handleUnavailableAction}>
                {t('page.login.enterprise.terms')}
              </button>
              <span className="skyroc-auth-copyright">© 2026 Skyroc</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
};

export const Route = createFileRoute('/(auth)/login')({
  component: LoginLayout,
  validateSearch: LoginSearchSchema,
  beforeLoad: async ({ context, search }) => {
    if (context.isLoggedIn) {
      throw redirect({ to: search.redirect || context.getHomeRoute() });
    }
  },
  staticData: {
    title: 'login',
    i18nKey: 'route.login'
  }
});
