import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from '../src/preset/drawer';

describe('Drawer', () => {
  it('uses dialog behavior with drawer content and side variants', async () => {
    render(
      <Drawer
        closeProps={{ children: <button type="button">Close drawer</button> }}
        contentProps={{ side: 'left' }}
        description="Drawer navigation."
        footer={null}
        title="Navigation"
        trigger={<button type="button">Open drawer</button>}
      >
        Navigation content
      </Drawer>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open drawer' }));

    const drawer = await screen.findByRole('dialog');

    expect(drawer).toHaveAttribute('data-slot', 'drawer-content');
    expect(drawer).toHaveAttribute('data-side', 'left');
    expect(drawer).toHaveClass('left-0');
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Navigation content')).toHaveClass('overflow-auto');
  });

  it('runs inherited OK actions from the dialog wrapper', async () => {
    const onOk = vi.fn();

    render(
      <Drawer
        closeProps={{ children: <button type="button">Close drawer</button> }}
        description="Drawer settings."
        okText="Done"
        scrollable={false}
        title="Edit settings"
        trigger={<button type="button">Open drawer</button>}
        onOk={onOk}
      >
        Settings content
      </Drawer>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open drawer' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Settings content')).not.toHaveClass('overflow-auto');

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(onOk).toHaveBeenCalledOnce();
  });
});
