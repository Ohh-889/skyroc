import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Label } from '../src/preset/label';
import { ConfigProvider } from '../src/preset/config-provider';
import { render, screen, setupUser } from './helpers/render';

describe('Label', () => {
  it('renders accessible labels, forwards refs, and focuses the labeled control', async () => {
    const user = setupUser();
    const ref = createRef<HTMLLabelElement>();

    render(
      <>
        <Label
          ref={ref}
          className="custom-label"
          htmlFor="email"
          size="lg"
        >
          Email
        </Label>
        <input id="email" />
      </>
    );

    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox');

    expect(ref.current).toBe(label);
    expect(label).toHaveClass('custom-label');

    await user.click(label);

    expect(input).toHaveFocus();
  });

  it('lets component props override provider label config', () => {
    render(
      <ConfigProvider label={{ className: 'provider-label', size: 'xl' }}>
        <Label
          className="prop-label"
          htmlFor="name"
        >
          Name
        </Label>
        <input id="name" />
      </ConfigProvider>
    );

    const label = screen.getByText('Name');

    expect(label).toHaveClass('prop-label');
    expect(label).not.toHaveClass('provider-label');
  });
});
