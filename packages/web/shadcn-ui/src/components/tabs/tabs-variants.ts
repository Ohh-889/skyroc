import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const tabsVariants = tv({
  compoundVariants: [
    { class: { content: 'mt-1.5', indicatorRoot: 'py-0.75' }, orientation: 'horizontal', size: 'xs' },
    { class: { content: 'ml-1.5', indicatorRoot: 'px-0.75' }, orientation: 'vertical', size: 'xs' },
    { class: { content: 'mt-1.75', indicatorRoot: 'py-1' }, orientation: 'horizontal', size: 'sm' },
    { class: { content: 'ml-1.75', indicatorRoot: 'px-1' }, orientation: 'vertical', size: 'sm' },
    { class: { content: 'mt-2', indicatorRoot: 'py-1' }, orientation: 'horizontal', size: 'md' },
    { class: { content: 'ml-2', indicatorRoot: 'px-1' }, orientation: 'vertical', size: 'md' },
    { class: { content: 'mt-2.5', indicatorRoot: 'py-1.125' }, orientation: 'horizontal', size: 'lg' },
    { class: { content: 'ml-2.5', indicatorRoot: 'px-1.125' }, orientation: 'vertical', size: 'lg' },
    { class: { content: 'mt-3', indicatorRoot: 'py-1.25' }, orientation: 'horizontal', size: 'xl' },
    { class: { content: 'ml-3', indicatorRoot: 'px-1.25' }, orientation: 'vertical', size: 'xl' },
    { class: { content: 'mt-3.5', indicatorRoot: 'py-1.5' }, orientation: 'horizontal', size: '2xl' },
    { class: { content: 'ml-3.5', indicatorRoot: 'px-1.5' }, orientation: 'vertical', size: '2xl' },
    // Line type horizontal
    { class: { indicator: '-bottom-[2px] h-[2px] w-full ', list: 'border-b-[2px] border-border bg-transparent rounded-none', trigger: 'rounded-none data-[state=active]:text-primary data-[state=active]:font-bold' }, orientation: 'horizontal', type: 'line' },
    // Line type vertical
    { class: { indicator: '-left-[2px] h-full w-[2px] ', list: 'border-l-[2px] border-border bg-transparent rounded-none', trigger: 'rounded-none data-[state=active]:text-primary data-[state=active]:font-bold' }, orientation: 'vertical', type: 'line' }
  ],
  defaultVariants: {
    size: 'md',
    orientation: 'horizontal',
    shape: 'square',
    fill: 'auto',
    enableIndicator: true,
    type: 'pill'
  },
  slots: {
    content: `flex-grow self-stretch overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary`,
    indicator: `size-full bg-background shadow`,
    indicatorRoot: `absolute top-0 left-0 z-2 transition-all duration-300`,
    list: 'relative inline-flex justify-center items-center bg-muted text-muted-foreground',
    root: `flex`,
    trigger: [
      `relative z-3 inline-flex items-center cursor-pointer justify-center flex-1 whitespace-nowrap rounded-md font-medium ease-in transition-all duration-200`,
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary`,
      `disabled:cursor-not-allowed disabled:opacity-50`
    ]
  },
  variants: {
    enableIndicator: {
      false: {
        trigger: `data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow`
      }
    },
    fill: {
      auto: {
        root: `items-start`
      },
      full: {
        root: `items-stretch`
      }
    },
    shape: {
      square: {
        list: 'rounded-md',
        indicator: 'rounded-md'
      },
      rounded: {
        list: 'rounded-full',
        indicator: 'rounded-full'
      }
    },
    type: {
      pill: {},
      line: {
        indicator: 'absolute  rounded-1 bg-primary '
      }
    },
    orientation: {
      horizontal: {
        indicatorRoot: `h-full w-[var(--skyroc-tabs-indicator-size)] translate-x-[var(--skyroc-tabs-indicator-position)]`,
        root: `flex-col`
      },
      vertical: {
        indicatorRoot: `w-full h-[var(--skyroc-tabs-indicator-size)] translate-y-[var(--skyroc-tabs-indicator-position)]`,
        list: `flex-col`
      }
    },
    size: {
      '2xl': {
        list: `p-1.5`,
        root: 'text-xl',
        trigger: `gap-4 px-6 py-1.5`
      },
      'lg': {
        list: `p-1.125`,
        root: 'text-base',
        trigger: `gap-2.5 px-4 py-1.125`
      },
      'md': {
        list: `p-1`,
        root: 'text-sm',
        trigger: `gap-2 px-3 py-1`
      },
      'sm': {
        list: `p-0.875`,
        root: 'text-xs',
        trigger: `gap-1.5 px-2 py-1`
      },
      'xl': {
        list: `p-1.25`,
        root: 'text-lg',
        trigger: `gap-3 px-5 py-1.25`
      },
      'xs': {
        list: `p-0.75`,
        root: 'text-2xs',
        trigger: `gap-1 px-1.5 py-0.75`
      }
    }
  }
});

export type TabsSlots = keyof typeof tabsVariants.slots;
export type TabsProps = VariantProps<typeof tabsVariants>;
export type TabsFill = NonNullable<TabsProps['fill']>;
export type TabsType = NonNullable<TabsProps['type']>;
