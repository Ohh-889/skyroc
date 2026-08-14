// Expo normally emits this reference into `expo-env.d.ts`, which is gitignored and only written when the Expo CLI
// runs. Declaring it here keeps `tsc --noEmit` working on a fresh clone — it is what makes `import './global.css'`
// (and the other Metro asset modules) typecheck.

/// <reference types="expo/types" />
