import { Button } from '@skyroc/native-ui';
import Feather from '@expo/vector-icons/Feather';
import { View } from 'react-native';

const ButtonSlot = () => {
  return (
    <View className="gap-3 bg-background p-6">
      <Button
        leading={
          <Feather
            color="#ffffff"
            name="download"
            size={18}
          />
        }
      >
        Download
      </Button>

      <Button
        variant="outline"
        trailing={
          <Feather
            color="#635bff"
            name="arrow-right"
            size={18}
          />
        }
      >
        Next Step
      </Button>

      {/* leading / trailing 同时存在，文字被夹在中间 */}
      <Button
        variant="tonal"
        leading={
          <Feather
            color="#635bff"
            name="heart"
            size={18}
          />
        }
        trailing={
          <Feather
            color="#635bff"
            name="arrow-right"
            size={18}
          />
        }
      >
        Favorite
      </Button>
    </View>
  );
};

export { ButtonSlot };
