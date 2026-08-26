import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import { describe, expect, it } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Tooltip } from '../src/preset/tooltip';
import { render, screen, setupUser } from './helpers/render';

async function findTooltipContent(text: string, className: string) {
  const elements = await screen.findAllByText(text);
  const content = elements.find(element => element.classList.contains(className));

  if (!content) {
    throw new Error(`Unable to find tooltip content for ${text}`);
  }

  return content;
}

describe('Tooltip', () => {
  it('renders tooltip content and arrow with slot class names', async () => {
    const user = setupUser();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip
          className="custom-tooltip-content"
          classNames={{
            arrow: 'custom-tooltip-arrow'
          }}
          content="Save changes"
          contentProps={{ align: 'start', side: 'bottom' }}
          delayDuration={0}
          showArrow
          size="lg"
        >
          <button type="button">Save</button>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Save' }));

    const tooltip = await findTooltipContent('Save changes', 'custom-tooltip-content');

    expect(tooltip).toHaveClass('custom-tooltip-content', 'px-3.5', 'text-base');
    expect(tooltip).toHaveAttribute('data-side', 'bottom');
    expect(tooltip).toHaveTextContent('Save changes');
    expect(document.querySelector('.custom-tooltip-arrow')).toHaveClass('text-sm');
  });

  it('uses ConfigProvider tooltip defaults and lets component props override them', async () => {
    const user = setupUser();

    const { unmount } = render(
      <TooltipProvider delayDuration={0}>
        <ConfigProvider
          tooltip={{
            className: 'configured-tooltip-content',
            classNames: {
              arrow: 'configured-tooltip-arrow'
            },
            showArrow: true,
            size: 'xs'
          }}
        >
          <Tooltip
            content="Configured tip"
            delayDuration={0}
          >
            <button type="button">Configured</button>
          </Tooltip>
        </ConfigProvider>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Configured' }));

    const configured = await findTooltipContent('Configured tip', 'configured-tooltip-content');

    expect(configured).toHaveClass('configured-tooltip-content', 'text-2xs');
    expect(document.querySelector('.configured-tooltip-arrow')).toHaveClass('text-3xs');

    unmount();

    render(
      <TooltipProvider delayDuration={0}>
        <ConfigProvider
          tooltip={{
            className: 'configured-tooltip-content',
            classNames: {
              arrow: 'configured-tooltip-arrow'
            },
            showArrow: true,
            size: 'xs'
          }}
        >
          <Tooltip
            className="override-tooltip-content"
            content="Override tip"
            delayDuration={0}
            showArrow={false}
            size="xl"
          >
            <button type="button">Override</button>
          </Tooltip>
        </ConfigProvider>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Override' }));

    const overridden = await findTooltipContent('Override tip', 'override-tooltip-content');

    expect(overridden).toHaveClass('override-tooltip-content', 'text-lg');
    expect(overridden).not.toHaveClass('configured-tooltip-content', 'text-2xs');
  });

  it('uses slot content class names when root className is not provided', async () => {
    const user = setupUser();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip
          classNames={{
            content: 'slot-tooltip-content'
          }}
          content="Slot tip"
          delayDuration={0}
        >
          <button type="button">Slot trigger</button>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Slot trigger' }));

    const tooltip = await findTooltipContent('Slot tip', 'slot-tooltip-content');

    expect(tooltip).toHaveClass('slot-tooltip-content');
    expect(document.querySelector('[data-slot="tooltip-arrow"]')).not.toBeInTheDocument();
  });
});
