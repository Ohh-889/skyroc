import { afterEach, describe, expect, it, vi } from 'vitest';
import { Kbd } from '../src/preset/keyboard-key';
import { useKeyboardKey } from '../src/components/keyboard-key';
import type { KbdValue } from '../src/components/keyboard-key';
import { render, screen, waitFor } from './helpers/render';

interface KeyboardKeyHookProbeProps {
  /** Keyboard value passed directly to the formatter hook. */
  value?: KbdValue;
}

const KeyboardKeyHookProbe = (props: KeyboardKeyHookProbeProps) => {
  const { value } = props;

  const { getKeyboardKey, isMacOS } = useKeyboardKey();

  return (
    <output
      aria-label="Keyboard result"
      data-macos={String(isMacOS)}
    >
      {getKeyboardKey(value)}
    </output>
  );
};

describe('KeyboardKey', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats grouped shortcut values with platform-neutral symbols', () => {
    render(
      <Kbd
        className="custom-kbd"
        size="lg"
        value={['ctrl', 'shift', 'k']}
        variant="solid"
      />
    );

    const key = screen.getByText('ctrl⇧K');

    expect(key).toHaveClass('custom-kbd');
    expect(key).toHaveAttribute('data-group');
    expect(key).toHaveAttribute('data-variant', 'solid');
  });

  it('can skip symbol formatting and lets children override formatted output', () => {
    render(
      <>
        <Kbd aria-label="Empty key" />
        <Kbd
          aria-label="Plain shortcut"
          symbolize={false}
          value={['ctrl', 'k']}
        />
        <Kbd value="enter">Submit</Kbd>
      </>
    );

    expect(screen.getByLabelText('Empty key')).toHaveTextContent('');
    expect(screen.getByLabelText('Plain shortcut')).toHaveTextContent('ctrlk');
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.queryByText('↵')).not.toBeInTheDocument();
  });

  it('uses macOS specific modifier symbols after platform detection', async () => {
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Macintosh; Intel Mac OS X');

    render(<Kbd value={['meta', 'alt', 'ctrl']} />);

    await waitFor(() => {
      expect(screen.getByText('⌘⌥⌃')).toBeInTheDocument();
    });
  });

  it('returns an empty label for missing hook values', () => {
    render(<KeyboardKeyHookProbe />);

    expect(screen.getByLabelText('Keyboard result')).toHaveTextContent('');
  });
});
