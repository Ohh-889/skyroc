import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex min-h-screen gap-8 items-center justify-center bg-background font-sans">
      <View className={'items-center gap-2'}>
        <Text className={'text-foreground font-semibold text-3xl'}>Next.js with Uniwind Example</Text>
        <Text className="font-bold text-2xl bg-linear-to-r from-amber-600 via-orange-700 to-red-800 bg-clip-text text-transparent">
          Love Uniwind ♥️
        </Text>
        <Text className={'text-foreground'}>
          All content on this page is styled with React Native components & tailwind classes
        </Text>
      </View>

      <View className={'p-6 border bg-card border-border rounded-2xl items-center justify-center gap-2'}>
        <Text className={'text-foreground font-semibold text-2xl'}>SSR support</Text>
        <Text className={'text-foreground'}>
          Server rendering is fully supported. Try disabling JavaScript and refreshing the page to try it out!
        </Text>
      </View>
    </View>
  );
}
