import { Card, Sonner, TooltipProvider } from '@skyroc/web-ui';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import type { Locale } from '../../i18n/config';
import { routing } from '../../i18n/routing';
import { BrandLogo, HeaderActions } from '../_components';

interface Props {
  /** Page content rendered inside the locale layout. */
  children: React.ReactNode;

  /** Dynamic route params provided by Next.js before locale validation. */
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

const LocaleLayout = async (props: Props) => {
  const { children, params } = props;

  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const validLocale = locale as Locale;

  // Enable static rendering
  setRequestLocale(validLocale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        disableTransitionOnChange
        attribute="class"
      >
        <TooltipProvider>
          <div
            data-vaul-drawer-wrapper
            className="h-full"
          >
            <Card
              className="h-full max-sm:h-auto"
              extra={<HeaderActions />}
              title={<BrandLogo />}
            >
              {children}
            </Card>
          </div>

          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
