import { Button, showConfirmDialog, showDialog } from '@skyroc/native-ui';
import { View } from 'react-native';

const DialogButtons = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() =>
          showConfirmDialog({
            cancelButtonText: '返回',
            confirmButtonText: '继续',
            message: '确认与取消按钮都支持自定义文案。',
            title: '按钮文案'
          })
        }
      >
        自定义文案
      </Button>
      <Button
        variant="tonal"
        onPress={() =>
          showDialog({
            message: '确认按钮已禁用，只能通过取消按钮关闭。',
            showCancelButton: true,
            confirmButtonDisabled: true,
            title: '禁用确认'
          })
        }
      >
        禁用确认
      </Button>
      <Button
        variant="tonal"
        onPress={() =>
          showConfirmDialog({
            confirmButtonColor: 'destructive',
            confirmButtonText: '删除',
            message: 'destructive 用于明确标识不可逆操作。',
            title: '破坏性操作'
          })
        }
      >
        危险按钮
      </Button>
      <Button
        variant="tonal"
        onPress={() =>
          showDialog({
            cancelButtonText: '知道了',
            message: 'showConfirmButton=false 可隐藏默认确认按钮。',
            showCancelButton: true,
            showConfirmButton: false,
            title: '仅取消按钮'
          })
        }
      >
        仅取消按钮
      </Button>
    </View>
  );
};

export { DialogButtons };
