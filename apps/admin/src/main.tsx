async function bootstrap() {
  if (import.meta.env.DEV) {
    await import('@shell/devtools/jotai');
  }

  await import('./bootstrap');
}

bootstrap();
