import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Textarea } from '../src/preset/textarea';
import { render, screen, setupUser } from './helpers/render';

describe('Textarea', () => {
  it('renders textarea slots, forwarded refs and updates character count', async () => {
    const user = setupUser();
    const ref = createRef<HTMLTextAreaElement>();
    const onChange = vi.fn();
    const onTextChange = vi.fn();

    render(
      <Textarea
        ref={ref}
        aria-label="Description"
        classNames={{
          content: 'custom-textarea-content',
          count: 'custom-textarea-count',
          root: 'custom-textarea-root'
        }}
        countGraphemes={value => String(value).length}
        countRender={count => `Count ${count}`}
        defaultValue="hello"
        maxLength={20}
        showCount
        size="lg"
        onChange={onChange}
        onTextChange={onTextChange}
      />
    );

    const textarea = screen.getByRole('textbox', { name: 'Description' });
    const root = textarea.closest('[data-slot="textarea-root"]');

    expect(ref.current).toBe(textarea);
    expect(root).toHaveClass('custom-textarea-root');
    expect(root).toHaveAttribute('data-size', 'lg');
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
    expect(textarea).toHaveClass('custom-textarea-content', 'min-h-9', 'text-base');
    expect(screen.getByText('Count 5 / 20')).toHaveClass('custom-textarea-count', 'text-base');

    await user.type(textarea, '!');

    expect(onChange).toHaveBeenCalled();
    expect(onTextChange).toHaveBeenLastCalledWith('hello!');
    expect(screen.getByText('Count 6 / 20')).toBeInTheDocument();
  });

  it('uses ConfigProvider textarea defaults and lets component props override them', () => {
    render(
      <ConfigProvider
        textarea={{
          className: 'configured-textarea-content',
          classNames: {
            count: 'configured-textarea-count',
            root: 'configured-textarea-root'
          },
          size: 'xs'
        }}
      >
        <Textarea
          aria-label="Configured textarea"
          defaultValue="abc"
          showCount
        />
        <Textarea
          aria-label="Overridden textarea"
          className="override-textarea-content"
          size="xl"
        />
      </ConfigProvider>
    );

    const configured = screen.getByRole('textbox', { name: 'Configured textarea' });
    const overridden = screen.getByRole('textbox', { name: 'Overridden textarea' });

    expect(configured.closest('[data-slot="textarea-root"]')).toHaveClass('configured-textarea-root');
    expect(configured).toHaveClass('configured-textarea-content', 'min-h-6', 'text-2xs');
    expect(screen.getByText('3')).toHaveClass('configured-textarea-count', 'text-2xs');
    expect(overridden).toHaveClass('override-textarea-content', 'min-h-10', 'text-lg');
    expect(overridden).not.toHaveClass('configured-textarea-content', 'min-h-6');
  });

  it('renders an empty count when value is missing', () => {
    render(
      <Textarea
        aria-label="Empty textarea"
        showCount
      />
    );

    expect(screen.getByRole('textbox', { name: 'Empty textarea' })).toHaveValue('');
    expect(screen.getByText('0')).toHaveAttribute('data-slot', 'textarea-count');
  });
});
