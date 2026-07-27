async function bootstrap() {
  if (import.meta.env.DEV) {
    await import('@skyroc/web-admin-devtools/jotai');
  }

  await import('./bootstrap');
}

bootstrap();
