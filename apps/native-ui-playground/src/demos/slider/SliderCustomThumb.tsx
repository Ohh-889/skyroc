import Ionicons from '@expo/vector-icons/Ionicons';
import { Slider } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

const ThumbIcon = withUniwind(Ionicons);

const SliderCustomThumb = () => {
  return (
    <View className="gap-6 bg-background px-6 py-4">
      <Slider
        defaultValue={50}
        thumbSize={28}
        thumb={
          <View className="size-7 items-center justify-center rounded-full bg-primary shadow-sm">
            <ThumbIcon
              colorClassName="accent-primary-foreground"
              name="reorder-two"
              size={16}
            />
          </View>
        }
      />
      <Slider
        range
        color="destructive"
        defaultValue={[30, 70]}
        thumbSize={20}
        endThumb={<View className="size-5 rounded-sm bg-destructive shadow-sm" />}
        startThumb={<View className="size-5 rounded-sm bg-destructive shadow-sm" />}
      />
    </View>
  );
};

export { SliderCustomThumb };
