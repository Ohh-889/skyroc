import { Button, showConfirmDialog, showDialog } from '@skyroc/native-ui';
import { View } from 'react-native';

const DialogBasic = () => {
  return (
    <View className="mb-8 flex-row flex-wrap items-center gap-3 bg-background px-6">
      <Button
        variant="tonal"
        onPress={() => showDialog({ message: '这是一段提示文案', title: '提示' })}
      >
        提示弹窗
      </Button>
      <Button
        variant="tonal"
        onPress={() => showConfirmDialog({ message: '删除后不可恢复，确定继续？', title: '确认删除' })}
      >
        确认弹窗
      </Button>
      <Button
        variant="tonal"
        onPress={() => showDialog('只传一段文案')}
      >
        纯文案
      </Button>
      <Button
        variant="tonal"
        onPress={() =>
          showConfirmDialog({
            confirmButtonColor: 'destructive',
            confirmButtonText: '注销',
            message: '注销后账号数据将被清空',
            title: '注销账号'
          })
        }
      >
        破坏性操作
      </Button>
    </View>
  );
};

export { DialogBasic };
