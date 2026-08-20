export function presetSkyrocUI() {
  return {
    '.animate-accordion-down': {
      animation: 'shadcn-down 0.2s ease-out'
    },
    '.animate-accordion-up': {
      animation: 'shadcn-up 0.2s ease-out'
    },
    '.animate-collapsible-down': {
      animation: 'shadcn-collapsible-down 0.2s ease-out'
    },
    '.animate-collapsible-up': {
      animation: 'shadcn-collapsible-up 0.2s ease-out'
    },
    '.flex-1-hidden': {
      '@apply flex-1 overflow-hidden': {}
    },
    '.flex-c': {
      '@apply flex flex-col': {}
    },
    '.flex-c-center': {
      '@apply flex justify-center items-center flex-col': {}
    },
    '.flex-c-stretch': {
      '@apply flex flex-col items-stretch': {}
    },
    '.flex-center': {
      '@apply flex justify-center items-center': {}
    },
    '.flex-x-center': {
      '@apply flex justify-center': {}
    },
    '.flex-y-center': {
      '@apply flex items-center': {}
    },
    '.i-flex-c': {
      '@apply inline-flex flex-col': {}
    },
    '.i-flex-c-center': {
      '@apply inline-flex justify-center items-center flex-col': {}
    },
    '.i-flex-c-stretch': {
      '@apply inline-flex flex-col items-stretch': {}
    },
    '.i-flex-center': {
      '@apply inline-flex justify-center items-center': {}
    },
    '.i-flex-x-center': {
      '@apply inline-flex justify-center': {}
    },
    '.i-flex-y-center': {
      '@apply inline-flex items-center': {}
    }
  };
}
