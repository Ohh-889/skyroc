import { Button, Text } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-red-500">
      <Text color="primary">Welcome to the Native UI Playground!</Text>
      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/button')}
      >
        Press Me
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/radio')}
      >
        Press Me
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/cell')}
      >
        Press Me
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/space')}
      >
        Press Me
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/divider')}
      >
        Press Me
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/tag')}
      >
        Press Me
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/rolling-text')}
      >
        Press Me
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/tabs')}
      >
        Press Me
      </Button>
    </View>
  );
}
