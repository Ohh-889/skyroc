import { Pagination } from '@skyroc/native-ui';
import { View } from 'react-native';

const PaginationDisabled = () => {
  return (
    <View className="bg-background p-4">
      <Pagination
        disabled
        defaultPage={3}
        itemsPerPage={10}
        totalItems={95}
      />
    </View>
  );
};

export { PaginationDisabled };
