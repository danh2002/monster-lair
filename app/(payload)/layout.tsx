import '@payloadcms/ui/scss/app.scss';
import type { ReactNode } from 'react';
import config from '@payload-config';
import { ProgressBar, RootProvider } from '@payloadcms/ui';
import { getClientConfig } from '@payloadcms/ui/utilities/getClientConfig';
import { cookies as nextCookies } from 'next/headers';
import { applyLocaleFiltering } from 'payload/shared';
import { handleServerFunctions } from '@payloadcms/next/layouts';
import { getNavPrefs } from '../../node_modules/@payloadcms/next/dist/elements/Nav/getNavPrefs.js';
import { getRequestTheme } from '../../node_modules/@payloadcms/next/dist/utilities/getRequestTheme.js';
import { initReq } from '../../node_modules/@payloadcms/next/dist/utilities/initReq.js';
import type { ServerFunctionClientArgs } from 'payload';
import { importMap } from './cms/importMap';

async function serverFunction(args: ServerFunctionClientArgs) {
  'use server';

  return handleServerFunctions({
    ...args,
    config: Promise.resolve(config),
    importMap,
  });
}

export default async function PayloadLayout({ children }: { children: ReactNode }) {
  const {
    cookies,
    headers,
    languageCode,
    permissions,
    req,
    req: {
      payload: { config: payloadConfig },
    },
  } = await initReq({
    configPromise: Promise.resolve(config),
    importMap,
    key: 'RootLayout',
  });

  const theme = getRequestTheme({
    config: payloadConfig,
    cookies,
    headers,
  });
  const languageOptions = Object.entries(payloadConfig.i18n.supportedLanguages || {}).reduce(
    (acc, [language, languageConfig]) => {
      const typedLanguageConfig = languageConfig as { translations: { general: { thisLanguage: string } } };

      if (Object.keys(payloadConfig.i18n.supportedLanguages).includes(language)) {
        acc.push({
          label: typedLanguageConfig.translations.general.thisLanguage,
          value: language,
        });
      }

      return acc;
    },
    [] as Array<{ label: string; value: string }>,
  );
  const navPrefs = await getNavPrefs(req);
  const clientConfig = getClientConfig({
    config: payloadConfig,
    i18n: req.i18n,
    importMap,
    user: req.user ?? true,
  });

  await applyLocaleFiltering({ clientConfig, config: payloadConfig, req });

  async function switchLanguageServerAction(lang: string): Promise<void> {
    'use server';

    const cookies = await nextCookies();
    cookies.set({
      name: `${payloadConfig.cookiePrefix || 'payload'}-lng`,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      value: lang,
    });
  }

  return (
    <RootProvider
      config={clientConfig}
      dateFNSKey={req.i18n.dateFNSKey}
      fallbackLang={payloadConfig.i18n.fallbackLanguage}
      isNavOpen={navPrefs?.open ?? true}
      languageCode={languageCode}
      languageOptions={languageOptions as never}
      locale={req.locale ?? undefined}
      permissions={req.user ? permissions : (null as never)}
      serverFunction={serverFunction}
      switchLanguageServerAction={switchLanguageServerAction}
      theme={theme}
      translations={req.i18n.translations}
      user={req.user}
    >
      <style>{`@layer payload-default, payload;`}</style>
      <ProgressBar />
      {children}
      <div id="portal" />
    </RootProvider>
  );
}
