import { Button, showConfirmDialog, showDialog } from '@skyroc/native-ui';
import { View } from 'react-native';

const DialogStyles = () => {
  return (
    <View className="mb-8 flex-row flex-wrap items-center gap-3 bg-background px-6">
      <Button
        variant="tonal"
        onPress={() =>
          showConfirmDialog({
            classNames: {
              confirmButton: 'bg-primary/10',
              header: 'pb-1',
              message: 'text-left',
              popup: 'w-[92%] max-w-[380px]',
              title: 'text-left'
            },
            message: 'popup 控制外层宽度，root 是卡片本身，其余 slot 逐个可覆盖',
            title: 'classNames 覆盖'
          })
        }
      >
        slot 覆盖
      </Button>
      <Button
        variant="tonal"
        onPress={() =>
          showDialog({
            className: 'rounded-3xl bg-carbon',
            classNames: { message: 'text-carbon-foreground', title: 'text-carbon-foreground' },
            message: 'className 覆盖的是卡片根节点',
            title: '深色卡片'
          })
        }
      >
        className 覆盖
      </Button>
    </View>
  );
};

export { DialogStyles };
