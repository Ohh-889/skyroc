import type useEmblaCarousel from 'embla-carousel-react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import type { ClassValue, HTMLComponentProps } from '../../types/shared';
import type { ButtonProps } from '../button';
import type { CarouselSlots } from './carousel-variants';

/**
 * Type definition for the Carousel API instance.
 * Provides access to carousel control methods and state.
 */
export type CarouselApi = UseEmblaCarouselType[1];

/**
 * Parameters type for the useEmblaCarousel hook.
 * Used to extract configuration and plugin types.
 */
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;

/**
 * Configuration options for the Embla carousel.
 * Controls carousel behavior such as speed, alignment, and loop settings.
 */
export type CarouselOptions = UseCarouselParameters[0];

/**
 * Plugin extensions for the Embla carousel.
 * Allows adding custom functionality like autoplay or custom effects.
 */
export type CarouselPlugin = UseCarouselParameters[1];

/**
 * Root configuration properties for the carousel component.
 * Defines the core settings and callbacks for carousel initialization.
 */
export interface CarouselRootType {
  /**
   * Embla carousel configuration options.
   * @see https://www.embla-carousel.com/api/options/
   */
  opts?: CarouselOptions;

  /**
   * Carousel scroll direction.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Plugin modules to extend carousel functionality.
   */
  plugins?: CarouselPlugin;

  /**
   * Callback function to receive the carousel API instance.
   * Allows programmatic control of the carousel.
   * @param api - The carousel API instance for controlling slides
   */
  setApi?: (api: CarouselApi) => void;
}

/**
 * Context properties for the carousel component.
 * Contains carousel state and control methods for child components.
 */
export type CarouselContextProps = {
  /**
   * The Embla carousel API instance.
   */
  api: ReturnType<typeof useEmblaCarousel>[1];

  /**
   * Indicates if the carousel can scroll forward.
   */
  canScrollNext: boolean;

  /**
   * Indicates if the carousel can scroll backward.
   */
  canScrollPrev: boolean;

  /**
   * Reference to the carousel container element.
   */
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];

  /**
   * Function to scroll the carousel forward to the next slide.
   */
  scrollNext: () => void;

  /**
   * Function to scroll the carousel backward to the previous slide.
   */
  scrollPrev: () => void;
} & CarouselRootType;

/**
 * Class names for different carousel UI slots.
 * Allows customizing styles for specific carousel parts.
 */
export type CarouselUi = Partial<Record<CarouselSlots, ClassValue>>;

/**
 * Props for the carousel content wrapper component.
 * Manages the layout and styling of slide items.
 */
export type CarouselContentProps = HTMLComponentProps<'div'> & {
  /**
   * Custom class names for content-related slots.
   */
  classNames?: Pick<CarouselUi, 'content' | 'contentWrapper'>;
};

/**
 * Props for individual carousel item/slide component.
 * Represents a single slide in the carousel.
 */
export type CarouselItemProps = HTMLComponentProps<'div'>;

/**
 * Props for the carousel next navigation button.
 * Extends button component properties.
 */
export type CarouselNextProps = ButtonProps;

/**
 * Props for the carousel previous navigation button.
 * Extends button component properties.
 */
export type CarouselPreviousProps = ButtonProps;

/**
 * Props for the carousel root/container component.
 * Combines HTML div properties with carousel configuration.
 */
export type CarouselRootProps = HTMLComponentProps<'div'> & CarouselRootType;

/**
 * Base carousel props without children.
 * Used as a foundation for carousel variants with different children types.
 */
export type CarouselPropsWithoutChildren = Omit<CarouselRootProps, 'children'> & {
  /**
   * Custom class names for carousel UI slots.
   */
  classNames?: CarouselUi;

  /**
   * Props for the carousel content component.
   */
  contentProps?: CarouselContentProps;

  /**
   * Number of slides to render when using index-based rendering.
   */
  counts?: number;

  /**
   * Props for the carousel item component.
   */
  itemProps?: CarouselItemProps;

  /**
   * Props to pass to the next navigation button.
   */
  nextProps?: Omit<ButtonProps, 'class'>;

  /**
   * Props to pass to the previous navigation button.
   */
  previousProps?: Omit<ButtonProps, 'class'>;
};

/**
 * Carousel component with render function children.
 * Allows dynamic slide generation based on slide index.
 *
 * @example
 * ```tsx
 * <Carousel counts={5}>
 *   {(index) => <div key={index}>Slide {index + 1}</div>}
 * </Carousel>
 * ```
 */
export interface CarouselWithSlotChildren extends CarouselPropsWithoutChildren {
  /**
   * Render function that receives the slide index and returns ReactNode.
   * Called for each slide to generate the content dynamically.
   * @param index - The zero-based index of the current slide
   */
  children: (index: number) => React.ReactNode;
}

/**
 * Carousel component with array of children.
 * Static list of slides passed as array elements.
 *
 * @example
 * ```tsx
 * <Carousel>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 *   <div>Slide 3</div>
 * </Carousel>
 * ```
 */
export interface CarouselWithChildrenArray extends CarouselPropsWithoutChildren {
  /**
   * Array of React nodes representing carousel slides.
   */
  children: React.ReactNode[];
}

/**
 * Union type for carousel props supporting both children patterns.
 * Choose between render function or array of slide elements.
 */
export type CarouselProps = CarouselWithSlotChildren | CarouselWithChildrenArray;
