import { defineConfig } from '@skyroc/web-admin-vite';

export default defineConfig({
  application: {
    css: {
      additionalData: '@use "@/styles/scss/global.scss" as *;'
    }
  }
});
