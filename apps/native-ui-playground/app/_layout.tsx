import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// Uniwind's CSS entry. Must be imported from the root component, not from index.js — importing it there downgrades
// hot reload to a full refresh.
// eslint-disable-next-line import/no-unassigned-import
import '../global.css';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { flex: 1 },
            animationMatchesGesture: true,
            animation: 'slide_from_right',
            orientation: 'portrait'
          }}
        />

        <StatusBar
          animated
          // oxlint-disable-next-line react/style-prop-object
          style="auto"
        />
      </View>
    </GestureHandlerRootView>
  );
}
