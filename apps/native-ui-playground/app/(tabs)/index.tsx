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
        onPress={() => router.push('/components/tabs')}
      >
        Press Me
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/collapse')}
      >
        Collapse
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/notify')}
      >
        Notify
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/count-down')}
      >
        CountDown
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/dialog')}
      >
        Dialog
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/rate')}
      >
        Rate
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/stepper')}
      >
        Stepper
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/password-input')}
      >
        PasswordInput
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/sheet')}
      >
        Sheet
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/action-sheet')}
      >
        ActionSheet
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/picker')}
      >
        Picker
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/anchor-nav')}
      >
        AnchorNav
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/floating-button')}
      >
        FloatingButton
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/back-top')}
      >
        BackTop
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/date-picker')}
      >
        DatePicker
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/calendar')}
      >
        Calendar
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/dropdown-menu')}
      >
        DropdownMenu
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/grid')}
      >
        Grid
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/field')}
      >
        Field
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/index-bar')}
      >
        IndexBar
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/pagination')}
      >
        Pagination
      </Button>

      <Button
        variant="solid"
        color="primary"
        onPress={() => router.push('/components/search')}
      >
        Search
      </Button>
    </View>
  );
}
