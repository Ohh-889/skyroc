import { Stack } from 'expo-router';
// Uniwind's CSS entry. Must be imported from the root component, not from index.js — importing it there downgrades
// hot reload to a full refresh.
// eslint-disable-next-line import/no-unassigned-import
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
