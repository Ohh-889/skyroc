import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import NotFoundClient from './not-found-client';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('notFound');

  return {
    title: `404 - ${t('title')}`,
    description: t('description'),
    robots: {
      index: false,
      follow: false
    }
  };
}

const NotFound = async () => {
  const locale = await getLocale();
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <NotFoundClient />
    </NextIntlClientProvider>
  );
};

export default NotFound;
