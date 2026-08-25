// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminLayout, LAYOUT_MAX_Z_INDEX, LAYOUT_SCROLL_EL_ID, PageTab } from '@shell/layouts/materials';
import adminLayoutStyles from '@shell/layouts/materials/libs/admin-layout/index.module.css';
import pageTabStyles from '@shell/layouts/materials/libs/page-tab/index.module.css';
import SvgClose from '@shell/layouts/materials/libs/page-tab/SvgClose';

afterEach(() => {
  cleanup();
});

describe('materials exports', () => {
  it('should expose layout constants and public components', () => {
    expect(LAYOUT_SCROLL_EL_ID).toBe('__SCROLL_EL_ID__');
    expect(LAYOUT_MAX_Z_INDEX).toBe(100);
    expect(AdminLayout).toBeTypeOf('function');
    expect(PageTab).toBeTruthy();
  });
});

describe('AdminLayout', () => {
  it('should render configured slots and assign default content scroll target', () => {
    const updateSiderCollapse = vi.fn();

    const { container } = render(
      <AdminLayout
        Footer={<div>Footer slot</div>}
        Header={<div>Header slot</div>}
        Sider={<div>Sider slot</div>}
        Tab={<div>Tab slot</div>}
        updateSiderCollapse={updateSiderCollapse}
      >
        <article>Main content</article>
      </AdminLayout>
    );

    expect(screen.getByText('Header slot')).toBeInTheDocument();
    expect(screen.getByText('Tab slot')).toBeInTheDocument();
    expect(screen.getByText('Sider slot')).toBeInTheDocument();
    expect(screen.getByText('Footer slot')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();

    const root = container.firstElementChild as HTMLElement;
    const main = screen.getByText('Main content').closest('main');
    const header = screen.getByText('Header slot').closest('header');

    expect(main).toHaveAttribute('id', LAYOUT_SCROLL_EL_ID);
    expect(main).toHaveClass('overflow-y-auto');
    expect(header).toHaveClass(adminLayoutStyles['layout-header']);
    expect(root.style.getPropertyValue('--soy-header-height')).toBe('56px');
    expect(root.style.getPropertyValue('--soy-tab-height')).toBe('44px');
    expect(root.style.getPropertyValue('--soy-sider-width')).toBe('220px');
  });

  it('should bind wrapper scrolling when scrollMode is wrapper', () => {
    const updateSiderCollapse = vi.fn();

    const { container } = render(
      <AdminLayout scrollMode="wrapper" updateSiderCollapse={updateSiderCollapse}>
        <span>Wrapper content</span>
      </AdminLayout>
    );

    const wrapper = container.querySelector(`#${LAYOUT_SCROLL_EL_ID}`);
    const main = screen.getByText('Wrapper content').closest('main');

    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('overflow-y-auto');
    expect(main).not.toHaveAttribute('id', LAYOUT_SCROLL_EL_ID);
  });

  it('should forward mobile sider mask clicks to updateSiderCollapse', () => {
    const updateSiderCollapse = vi.fn();

    render(
      <AdminLayout isMobile Sider={<span>Mobile sider</span>} updateSiderCollapse={updateSiderCollapse}>
        <span>Mobile content</span>
      </AdminLayout>
    );

    const sider = screen.getByText('Mobile sider').closest('aside');
    const mask = sider?.nextElementSibling;

    expect(mask).toBeInstanceOf(HTMLElement);

    fireEvent.click(mask as HTMLElement);

    expect(updateSiderCollapse).toHaveBeenCalledTimes(1);
  });

  it('should calculate horizontal desktop sider z-index', () => {
    const updateSiderCollapse = vi.fn();

    const { container } = render(
      <AdminLayout mode="horizontal" updateSiderCollapse={updateSiderCollapse}>
        <span>Horizontal content</span>
      </AdminLayout>
    );

    const root = container.firstElementChild as HTMLElement;

    expect(root.style.getPropertyValue('--soy-sider-z-index')).toBe('96');
  });
});

describe('PageTab', () => {
  it('should render a clickable tab with active color variables and close handling', () => {
    const handleClick = vi.fn();
    const handleClose = vi.fn();

    const { container } = render(
      <PageTab
        active
        activeColor="#ff4d4f"
        buttonClass="button-mode"
        handleClose={handleClose}
        mode="button"
        onClick={handleClick}
        prefix={<span>Icon</span>}
      >
        <span>Dashboard</span>
      </PageTab>
    );

    const tabText = screen.getByText('Dashboard');
    const tab = tabText.closest('div') as HTMLElement;
    const closeButton = container.querySelector('svg')?.parentElement;

    fireEvent.click(tabText);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(tab).toHaveClass(pageTabStyles['button-tab']);
    expect(tab).toHaveClass('button-mode');
    expect((tab as HTMLElement).style.getPropertyValue('--soy-primary-color')).toBe('#ff4d4f');
    expect(closeButton).toBeInstanceOf(HTMLElement);

    fireEvent.click(closeButton as HTMLElement);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should omit the default close icon when closable is false', () => {
    const handleClick = vi.fn();

    const { container } = render(
      <PageTab closable={false} mode="slider" onClick={handleClick} prefix={<span>Icon</span>}>
        <span>Profile</span>
      </PageTab>
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('should treat touch start and touch end as a tap', () => {
    const handleClick = vi.fn();

    render(
      <PageTab mode="chrome" onClick={handleClick} prefix={<span>Icon</span>}>
        <span>Reports</span>
      </PageTab>
    );

    const tab = screen.getByText('Reports');

    fireEvent.touchStart(tab);
    fireEvent.touchEnd(tab);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should cancel touch tap when touch moves', () => {
    const handleClick = vi.fn();

    render(
      <PageTab mode="chrome" onClick={handleClick} prefix={<span>Icon</span>}>
        <span>Tasks</span>
      </PageTab>
    );

    const tab = screen.getByText('Tasks');

    fireEvent.touchStart(tab);
    fireEvent.touchMove(tab);
    fireEvent.touchEnd(tab);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply active dark classes for chrome and slider modes', () => {
    const handleClick = vi.fn();

    render(
      <>
        <PageTab active closable={false} darkMode mode="chrome" onClick={handleClick} prefix={<span>Icon</span>}>
          <span>Chrome dark</span>
        </PageTab>
        <PageTab active closable={false} darkMode mode="slider" onClick={handleClick} prefix={<span>Icon</span>}>
          <span>Slider dark</span>
        </PageTab>
      </>
    );

    const chromeTab = screen.getByText('Chrome dark').closest('div');
    const sliderTab = screen.getByText('Slider dark').closest('div');

    expect(chromeTab).toHaveClass(pageTabStyles['chrome-tab_active_dark']);
    expect(sliderTab).toHaveClass(pageTabStyles['slider-tab_active_dark']);
  });
});

describe('SvgClose', () => {
  it('should support touch close and ignore moved touches', () => {
    const handleClose = vi.fn();

    const { container } = render(<SvgClose onClick={handleClose} />);

    const closeButton = container.firstElementChild as HTMLElement;

    fireEvent.touchStart(closeButton);
    fireEvent.touchEnd(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.touchStart(closeButton);
    fireEvent.touchMove(closeButton);
    fireEvent.touchEnd(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should ignore touch close when onClick is not provided', () => {
    const { container } = render(<SvgClose />);

    const closeButton = container.firstElementChild as HTMLElement;

    fireEvent.touchStart(closeButton);
    fireEvent.touchEnd(closeButton);

    expect(closeButton).toBeInTheDocument();
  });
});
