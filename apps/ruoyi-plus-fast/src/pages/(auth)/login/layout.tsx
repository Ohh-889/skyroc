import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

const LoginSearchSchema = z.object({
  redirect: z.string().startsWith('/').optional()
});

const LoginLayout = () => {
  const { t } = useTranslation();

  function handleUnavailableAction() {
    showInfoMessage(t('page.login.enterprise.notConfigured'));
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-layout p-0 lt-md:p-12px">
      <div className="relative min-h-screen flex overflow-hidden rounded-12px border border-border-secondary border-solid shadow-xl lt-md:min-h-[calc(100vh-24px)] lt-md:overflow-visible">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-37% top-9% size-22vw max-size-320px min-size-180px translate-x--50% translate-y--50% rounded-full bg-primary-bg opacity-80"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-92% top-15% size-20vw max-size-300px min-size-170px translate-x--50% translate-y--50% rounded-full bg-primary-bg opacity-45"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4% top-93% size-20vw max-size-300px min-size-170px translate-x--50% translate-y--50% rounded-full bg-primary-bg opacity-65"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-51% top-99% size-22vw max-size-320px min-size-180px translate-x--50% translate-y--50% rounded-full bg-primary-bg opacity-45"
        />
        <header className="absolute left-48px top-34px z-4 flex-y-center gap-14px lt-md:left-22px lt-md:top-20px">
          <SystemLogo className="size-40px shrink-0 text-primary lt-md:size-32px" />
          <p className="m-0 text-18px text-primary font-700 tracking-0.8px lt-md:text-15px">{t('system.title')}</p>
        </header>

        <section className="relative min-h-718px min-w-0 w-full flex-center bg-transparent px-48px pb-42px pt-70px lt-md:min-h-[calc(100vh-26px)] lt-md:items-start lt-md:px-22px lt-md:pb-24px lt-md:pt-76px">
          <div className="w-full max-w-472px rounded-18px border border-border-secondary border-solid bg-container px-36px pb-24px pt-34px shadow-xl lt-md:translate-y-0 lt-md:border-0 lt-md:bg-transparent lt-md:p-0 lt-md:shadow-none">
            <Outlet />

            <footer className="mt-16px flex-center gap-16px text-11px text-tertiary lt-md:mt-20px lt-md:flex-wrap">
              <button
                className="cursor-pointer border-0 bg-transparent p-0 text-inherit hover:text-primary"
                type="button"
                onClick={handleUnavailableAction}
              >
                {t('page.login.enterprise.privacy')}
              </button>
              <span>·</span>
              <button
                className="cursor-pointer border-0 bg-transparent p-0 text-inherit hover:text-primary"
                type="button"
                onClick={handleUnavailableAction}
              >
                {t('page.login.enterprise.terms')}
              </button>
              <span className="ml-18px lt-md:ml-0 lt-md:w-full lt-md:text-center">© 2026 Skyroc</span>
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
