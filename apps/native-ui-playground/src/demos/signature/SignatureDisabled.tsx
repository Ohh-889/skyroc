import { Signature } from '@skyroc/native-ui';
import { View } from 'react-native';

const SignatureDisabled = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <Signature
        disabled
        tips="禁用状态"
      />
      <Signature
        readonly
        tips="只读：画不上，但按钮仍可用"
      />
    </View>
  );
};

export { SignatureDisabled };
