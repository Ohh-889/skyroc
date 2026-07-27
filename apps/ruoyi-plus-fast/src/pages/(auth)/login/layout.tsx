import { mixColor } from '@skyroc/color';
import { useSettingsTheme } from '@skyroc/web-admin-theme';
import { Outlet, createFileRoute, redirect, useLocation } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import { z } from 'zod';

const COLOR_WHITE = '#ffffff';

const LoginSearchSchema = z.object({
  redirect: z.string().startsWith('/').optional()
});

const LoginLayout = () => {
  const { t } = useTranslation();

  const { darkMode, themeColor } = useSettingsTheme();

  const ratio = darkMode ? 0.5 : 0.2;

  const location = useLocation();

  const bgColor = mixColor(COLOR_WHITE, themeColor, ratio);

  return (
    <div className="relative size-full flex-center overflow-hidden bg-layout" style={{ backgroundColor: bgColor }}>
      <ACard className="relative z-4 w-auto rd-8px" variant="borderless">
        <div className="w-400px lt-sm:w-300px">
          <div className="text-center">
            <h1 className="m-0 text-28px font-600 text-primary">{t('system.title')}</h1>
            <p className="m-0 mt-8px text-14px text-text-2">{t('page.login.common.loginOrRegister')}</p>
          </div>

          <AnimatePresence initial={false} mode="wait">
            <motion.main
              layout
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              className="pt-24px"
              exit={{ opacity: 0, x: 28, filter: 'blur(6px)' }}
              initial={{ opacity: 0, x: -28, filter: 'blur(6px)' }}
              key={location.pathname}
              style={{
                willChange: 'transform, opacity, filter'
              }}
              transition={{
                x: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.18, ease: 'easeOut' },
                filter: { duration: 0.18, ease: 'easeOut' }
              }}
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </ACard>
    </div>
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
