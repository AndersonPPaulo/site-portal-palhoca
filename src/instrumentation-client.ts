// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const isProduction = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: 'https://e2a8550d4054629f784c4c27c0b63483@o4510908840280064.ingest.us.sentry.io/4510909013164032',

  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development',

  // Desabilita envio em desenvolvimento para economizar quota
  enabled: isProduction,

  integrations: [Sentry.replayIntegration()],

  // 10% das traces em produção - evita consumir plano rapidamente
  tracesSampleRate: isProduction ? 0.1 : 0,

  // Logs consomem muitos eventos - desabilitado para economizar
  enableLogs: false,

  // 5% das sessões com Replay (era 10%) - Replay gera muitos eventos
  replaysSessionSampleRate: isProduction ? 0.05 : 0,

  // 100% quando há erro - mantém para debug de problemas reais
  replaysOnErrorSampleRate: 1.0,

  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
