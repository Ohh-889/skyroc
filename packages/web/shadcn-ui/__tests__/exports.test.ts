import { describe, expect, it } from 'vitest';
import * as Hooks from '../src/hooks';
import * as WebUi from '../src';
import * as Primitives from '../src/components';

describe('public exports', () => {
  it('exposes the config-aware preset entry surface', () => {
    expect(WebUi.Button).toBeDefined();
    expect(WebUi.Checkbox).toBeDefined();
    expect(WebUi.ConfigProvider).toBeDefined();
    expect(WebUi.Dialog).toBeDefined();
    expect(WebUi.DropdownMenu).toBeDefined();
    expect(WebUi.Drawer).toBeDefined();
    expect(WebUi.NumberInput).toBeDefined();
    expect(WebUi.Pagination).toBeDefined();
    expect(WebUi.Select).toBeDefined();
    expect(WebUi.Sonner).toBeDefined();
    expect(WebUi.Switch).toBeDefined();
    expect(WebUi.Tabs).toBeDefined();
    expect(WebUi.Tag).toBeDefined();
    expect(WebUi.Textarea).toBeDefined();
    expect(WebUi.Toggle).toBeDefined();
    expect(WebUi.Tooltip).toBeDefined();
    expect(WebUi.Tree).toBeDefined();
    expect(WebUi.VirtualGrid).toBeDefined();
    expect(WebUi.VirtualList).toBeDefined();
    expect(WebUi.cn).toBeTypeOf('function');
  });

  it('exposes primitive components and hooks from their dedicated entrypoints', () => {
    expect(Primitives.Button).toBeDefined();
    expect(Primitives.CheckboxControl).toBeDefined();
    expect(Primitives.DialogContent).toBeDefined();
    expect(Primitives.DrawerContent).toBeDefined();
    expect(Primitives.NumberInput).toBeDefined();
    expect(Primitives.Pagination).toBeDefined();
    expect(Primitives.Select).toBeDefined();
    expect(Primitives.Sonner).toBeDefined();
    expect(Primitives.Tag).toBeDefined();
    expect(Primitives.Textarea).toBeDefined();
    expect(Primitives.Toggle).toBeDefined();
    expect(Primitives.ToggleGroup).toBeDefined();
    expect(Primitives.Tooltip).toBeDefined();
    expect(Primitives.Tree).toBeDefined();
    expect(Primitives.VirtualGrid).toBeDefined();
    expect(Primitives.VirtualList).toBeDefined();
    expect(Hooks.useMediaQuery).toBeTypeOf('function');
  });
});
