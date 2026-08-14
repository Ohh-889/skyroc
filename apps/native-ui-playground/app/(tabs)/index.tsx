import { Button } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/native-ui';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

const COLORS: ThemeColor[] = ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info', 'carbon'];

export default function HomeScreen() {
  const { hasAdaptiveThemes, theme } = useUniwind();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="gap-8 p-5">
        <View className="gap-3">
          <Text className="text-2xl font-bold text-foreground">@skyroc/native-ui</Text>
          <Text className="text-sm text-muted-foreground">
            当前主题：{hasAdaptiveThemes ? `system (${theme})` : theme}
          </Text>
          <View className="flex-row gap-2">
            <Button
              fitContent
              onPress={() => Uniwind.setTheme('light')}
              size="sm"
              variant="outline"
            >
              Light
            </Button>
            <Button
              fitContent
              onPress={() => Uniwind.setTheme('dark')}
              size="sm"
              variant="outline"
            >
              Dark
            </Button>
            <Button
              fitContent
              onPress={() => Uniwind.setTheme('system')}
              size="sm"
              variant="outline"
            >
              System
            </Button>
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-base font-semibold text-foreground">Variant</Text>
          <View className="flex-row flex-wrap gap-2">
            <Button
              fitContent
              variant="solid"
            >
              Solid
            </Button>
            <Button
              fitContent
              variant="soft"
            >
              Soft
            </Button>
            <Button
              fitContent
              variant="outline"
            >
              Outline
            </Button>
            <Button
              fitContent
              variant="ghost"
            >
              Ghost
            </Button>
            <Button
              fitContent
              variant="link"
            >
              Link
            </Button>
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-base font-semibold text-foreground">Color</Text>
          <View className="flex-row flex-wrap gap-2">
            {COLORS.map(color => (
              <Button
                color={color}
                fitContent
                key={color}
                size="sm"
              >
                {color}
              </Button>
            ))}
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-base font-semibold text-foreground">Size</Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <Button
              fitContent
              size="xs"
            >
              xs
            </Button>
            <Button
              fitContent
              size="sm"
            >
              sm
            </Button>
            <Button
              fitContent
              size="md"
            >
              md
            </Button>
            <Button
              fitContent
              size="lg"
            >
              lg
            </Button>
            <Button
              fitContent
              size="xl"
            >
              xl
            </Button>
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-base font-semibold text-foreground">State</Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <Button
              fitContent
              loading
            >
              Loading
            </Button>
            <Button
              disabled
              fitContent
            >
              Disabled
            </Button>
            <Button
              fitContent
              shape="rounded"
            >
              Rounded
            </Button>
            <Button
              fitContent
              shape="circle"
            >
              <Text className="text-lg text-primary-foreground">+</Text>
            </Button>
          </View>
        </View>

        <Button
          onPress={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}
          size="lg"
        >
          全宽按钮（stretch）
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
