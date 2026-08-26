'use client';

import { useEffect, useState } from 'react';
import type { KbdKey, KbdValue } from './types';

interface SpecificKeyboardKeyMap {
  alt: string;
  ctrl: string;
  meta: string;
}

export const builtinKeyboardKeyMap: Record<KbdKey, string> = {
  alt: '',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  arrowup: '↑',
  backspace: '⌫',
  capslock: '⇪',
  command: '⌘',
  ctrl: '',
  delete: '⌦',
  end: '↘',
  enter: '↵',
  escape: '⎋',
  home: '↖',
  meta: '',
  option: '⌥',
  pagedown: '⇟',
  pageup: '⇞',
  shift: '⇧',
  tab: '⇥',
  win: '⊞'
};

export function useKeyboardKey() {
  const [isMacOS, setIsMacOS] = useState(false);

  const specificMapRef: SpecificKeyboardKeyMap = {
    alt: isMacOS ? builtinKeyboardKeyMap.option : 'alt',
    ctrl: isMacOS ? '⌃' : 'ctrl',
    meta: isMacOS ? builtinKeyboardKeyMap.command : builtinKeyboardKeyMap.win
  };

  const getKeyboardKey = (value?: KbdValue) => {
    if (!value)
      return '';

    if (value === 'meta' || value === 'alt' || value === 'ctrl') {
      return specificMapRef[value as keyof SpecificKeyboardKeyMap];
    }

    return builtinKeyboardKeyMap[value as KbdKey] || value.toUpperCase();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMacOS(/Macintosh;/.test(navigator.userAgent));
  }, []);

  return {
    getKeyboardKey,
    isMacOS
  };
}
