'use client';

import { Check, Copy } from 'lucide-react';
import { useRef, useState } from 'react';

const INSTALL_COMMAND = 'pnpm add @skyroc/web-ui';

export const InstallCommand = () => {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleCopy() {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      aria-label="复制安装命令"
      className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-border/65 bg-background/70 px-4 font-mono text-xs text-foreground shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
      onClick={handleCopy}
      type="button"
    >
      <span className="text-muted-foreground">$</span>
      <span>{INSTALL_COMMAND}</span>
      {copied ? (
        <Check
          aria-hidden="true"
          className="text-success"
          size={15}
        />
      ) : (
        <Copy
          aria-hidden="true"
          className="text-muted-foreground transition-colors group-hover:text-primary"
          size={15}
        />
      )}
    </button>
  );
};
