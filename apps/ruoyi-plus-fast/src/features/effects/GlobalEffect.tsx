import { LangEffect } from '@skyroc/web-admin-i18n';
import { ThemeEffect } from '@skyroc/web-admin-theme';

import { syncLocales } from '@/locales/sync';

import SseEffect from '../sse/SseEffect';
import WebSocketEffect from '../websocket/WebSocketEffect';

const GlobalEffect = () => {
  return (
    <>
      <ThemeEffect />
      <LangEffect onLocaleChange={syncLocales} />
      <WebSocketEffect />
      <SseEffect />
    </>
  );
};

export default GlobalEffect;
