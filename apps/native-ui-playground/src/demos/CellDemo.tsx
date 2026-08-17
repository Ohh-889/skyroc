import { Cell, CellGroup, Text } from '@skyroc/native-ui';
import { Alert, ScrollView, View } from 'react-native';

const CellDemo = () => {
  function handlePress() {
    Alert.alert('Cell Pressed');
  }

  return (
    <ScrollView className="flex-1 bg-muted p-6">
      {/* Basic */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8">
        <Cell title="Cell Title" />
        <Cell
          subtitle="Description text"
          title="Cell Title"
        />
        <Cell
          subtitle="Description text"
          title="Cell Title"
          trailing="Value"
        />
      </View>

      {/* Clickable */}
      <Text className="mb-4 text-lg font-semibold">Clickable</Text>
      <View className="mb-8">
        <Cell
          title="Clickable Cell"
          onPress={handlePress}
        />
        <Cell
          showArrow
          subtitle="With subtitle"
          title="With Arrow"
          onPress={handlePress}
        />
      </View>

      {/* Leading */}
      <Text className="mb-4 text-lg font-semibold">Leading</Text>
      <View className="mb-8">
        <Cell
          leading={
            <View className="size-8 items-center justify-center rounded-md bg-primary">
              <Text className="text-sm text-primary-foreground">A</Text>
            </View>
          }
          subtitle="Description"
          title="With Icon"
        />
        <Cell
          leading={
            <View className="size-8 items-center justify-center rounded-full bg-secondary">
              <Text className="text-sm text-secondary-foreground">B</Text>
            </View>
          }
          title="With Avatar"
          trailing="Detail"
        />
      </View>

      {/* Trailing + Arrow */}
      <Text className="mb-4 text-lg font-semibold">Trailing + Arrow</Text>
      <View className="mb-8">
        <Cell
          showArrow
          title="Show Arrow"
          onPress={handlePress}
        />
        <Cell
          showArrow
          arrowDirection="down"
          title="Arrow Down"
          trailing="Expand"
          onPress={handlePress}
        />
        <Cell
          showArrow
          arrowDirection="up"
          title="Arrow Up"
          onPress={handlePress}
        />
      </View>

      {/* CellGroup */}
      <Text className="mb-4 text-lg font-semibold">CellGroup</Text>
      <View className="mb-8">
        <CellGroup title="Group Title">
          <Cell
            title="Cell 1"
            trailing="Value"
          />
          <Cell
            title="Cell 2"
            trailing="Value"
          />
          <Cell
            showArrow
            title="Cell 3"
            onPress={handlePress}
          />
        </CellGroup>
      </View>

      {/* Inset */}
      <Text className="mb-4 text-lg font-semibold">Inset</Text>
      <View className="mb-8">
        <CellGroup
          inset
          title="Inset Group"
        >
          <Cell
            title="Cell 1"
            trailing="Value"
          />
          <Cell
            title="Cell 2"
            trailing="Value"
          />
          <Cell
            showArrow
            title="Cell 3"
            trailing="Value"
            onPress={handlePress}
          />
        </CellGroup>
      </View>

      {/* Sizes */}
      <Text className="mb-4 text-lg font-semibold">Sizes</Text>
      <View className="mb-8">
        <Cell
          size="sm"
          subtitle="Small size"
          title="Small"
        />
        <Cell
          size="md"
          subtitle="Medium size"
          title="Medium"
        />
        <Cell
          size="lg"
          subtitle="Large size"
          title="Large"
        />
      </View>

      {/* Disabled */}
      <Text className="mb-4 text-lg font-semibold">Disabled</Text>
      <View className="mb-8">
        <Cell
          disabled
          showArrow
          title="Disabled Cell"
          trailing="Cannot Press"
          onPress={handlePress}
        />
      </View>
    </ScrollView>
  );
};

export { CellDemo };
