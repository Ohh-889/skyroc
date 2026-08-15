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
        onPress={() => router.push('/components/toast')}
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

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/popup')}
      >
        Press Me
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/badge')}
      >
        Badge
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/image')}
      >
        Image
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/checkbox')}
      >
        Checkbox
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/input')}
      >
        Input
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/avatar')}
      >
        Avatar
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/collapse')}
      >
        Collapse
      </Button>
    </View>
  );
}
