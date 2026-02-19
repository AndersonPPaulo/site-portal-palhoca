// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const isProduction = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: 'https://e2a8550d4054629f784c4c27c0b63483@o4510908840280064.ingest.us.sentry.io/4510909013164032',

  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',

  // Desabilita envio em desenvolvimento para economizar quota
  enabled: isProduction,

  // 10% das traces em produção - evita consumir plano rapidamente
  tracesSampleRate: isProduction ? 0.1 : 0,

  // Logs consomem muitos eventos - desabilitado para economizar
  enableLogs: false,

  sendDefaultPii: true,
});
