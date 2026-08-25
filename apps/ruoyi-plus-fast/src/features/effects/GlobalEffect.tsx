import { LangEffect } from '@shell/i18n';
import { ThemeEffect } from '@shell/theme';

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
