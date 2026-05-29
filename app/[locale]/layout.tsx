import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Roboto } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/registry';
import { GlobalStyles } from '@/styles/globalStyles';
import { AuthProvider } from '@/context/AuthContext';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';

const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});

const LOCALES = ['vi', 'en', 'zh'] as const;

export function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }, { locale: 'zh' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div lang={locale} className={`${roboto.className} ${roboto.variable}`}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <StyledComponentsRegistry>
          <AuthProvider>
            <GlobalStyles />
            {children}
          </AuthProvider>
        </StyledComponentsRegistry>
      </NextIntlClientProvider>
      <Analytics />
    </div>
  );
}
