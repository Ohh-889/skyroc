"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleSheet } from "react-native";

export function ReactNativeWebStyleSheet() {
  const hasInserted = useRef(false);
  useServerInsertedHTML(() => {
    if (hasInserted.current) return;
    hasInserted.current = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sheet = (StyleSheet as any).getSheet();

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: sheet.textContent,
        }}
        id={sheet.id}
      />
    );
  });
  return null;
}
