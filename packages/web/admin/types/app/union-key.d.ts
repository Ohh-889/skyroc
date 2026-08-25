/** The union key namespace */
declare global {
  namespace UnionKey {
    /** Login module */
    type LoginModule = 'bind-wechat' | 'code-login' | 'pwd-login' | 'register' | 'reset-pwd';

    /**
     * The layout mode
     *
     * - Vertical: the vertical menu in left
     * - Horizontal: the horizontal menu in top
     * - Vertical-mix: two vertical mixed menus in left
     * - Top-hybrid-sidebar-first: the vertical first level menus in left and horizontal child level menus in top
     * - Top-hybrid-header-first: the horizontal first level menus in top and vertical child level menus in left
     */
    type ThemeLayoutMode =
      | 'horizontal'
      | 'top-hybrid-header-first'
      | 'top-hybrid-sidebar-first'
      | 'vertical'
      | 'vertical-hybrid-header-first'
      | 'vertical-mix';

    /**
     * The scroll mode when content overflow
     *
     * - Wrapper: the wrapper component's root element overflow
     * - Content: the content component overflow
     */
    type ThemeScrollMode = 'content' | 'wrapper';

    /** Page animate mode */
    type ThemePageAnimateMode =
      | 'fade'
      | 'fade-bottom'
      | 'fade-scale'
      | 'fade-slide'
      | 'none'
      | 'zoom-fade'
      | 'zoom-out';

    /**
     * Tab mode
     *
     * - Chrome: chrome style
     * - Button: button style
     */
    type ThemeTabMode = 'button' | 'chrome' | 'slider';

    /** Unocss animate key */
    type UnoCssAnimateKey =
      | 'back-in-down'
      | 'back-in-left'
      | 'back-in-right'
      | 'back-in-up'
      | 'back-out-down'
      | 'back-out-left'
      | 'back-out-right'
      | 'back-out-up'
      | 'bounce'
      | 'bounce-alt'
      | 'bounce-in'
      | 'bounce-in-down'
      | 'bounce-in-left'
      | 'bounce-in-right'
      | 'bounce-in-up'
      | 'bounce-out'
      | 'bounce-out-down'
      | 'bounce-out-left'
      | 'bounce-out-right'
      | 'bounce-out-up'
      | 'fade-in'
      | 'fade-in-bottom-left'
      | 'fade-in-bottom-right'
      | 'fade-in-down'
      | 'fade-in-down-big'
      | 'fade-in-left'
      | 'fade-in-left-big'
      | 'fade-in-right'
      | 'fade-in-right-big'
      | 'fade-in-top-left'
      | 'fade-in-top-right'
      | 'fade-in-up'
      | 'fade-in-up-big'
      | 'fade-out'
      | 'fade-out-bottom-left'
      | 'fade-out-bottom-right'
      | 'fade-out-down'
      | 'fade-out-down-big'
      | 'fade-out-left'
      | 'fade-out-left-big'
      | 'fade-out-right'
      | 'fade-out-right-big'
      | 'fade-out-top-left'
      | 'fade-out-top-right'
      | 'fade-out-up'
      | 'fade-out-up-big'
      | 'flash'
      | 'flip'
      | 'flip-in-x'
      | 'flip-in-y'
      | 'flip-out-x'
      | 'flip-out-y'
      | 'head-shake'
      | 'heart-beat'
      | 'hinge'
      | 'jack-in-the-box'
      | 'jello'
      | 'light-speed-in-left'
      | 'light-speed-in-right'
      | 'light-speed-out-left'
      | 'light-speed-out-right'
      | 'ping'
      | 'pulse'
      | 'pulse-alt'
      | 'roll-in'
      | 'roll-out'
      | 'rotate-in'
      | 'rotate-in-down-left'
      | 'rotate-in-down-right'
      | 'rotate-in-up-left'
      | 'rotate-in-up-right'
      | 'rotate-out'
      | 'rotate-out-down-left'
      | 'rotate-out-down-right'
      | 'rotate-out-up-left'
      | 'rotate-out-up-right'
      | 'rubber-band'
      | 'shake-x'
      | 'shake-y'
      | 'slide-in-down'
      | 'slide-in-left'
      | 'slide-in-right'
      | 'slide-in-up'
      | 'slide-out-down'
      | 'slide-out-left'
      | 'slide-out-right'
      | 'slide-out-up'
      | 'spin'
      | 'swing'
      | 'tada'
      | 'wobble'
      | 'zoom-in'
      | 'zoom-in-down'
      | 'zoom-in-left'
      | 'zoom-in-right'
      | 'zoom-in-up'
      | 'zoom-out'
      | 'zoom-out-down'
      | 'zoom-out-left'
      | 'zoom-out-right'
      | 'zoom-out-up';
  }
}

export {};
