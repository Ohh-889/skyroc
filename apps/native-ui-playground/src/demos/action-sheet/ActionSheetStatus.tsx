import type { ActionSheetAction } from '@skyroc/native-ui';
import { ActionSheet, Button } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const STATUS_ACTIONS: ActionSheetAction[] = [
  { name: '正常选项', subname: 'subname 可补充操作说明', value: 'normal' },
  { disabled: true, name: '禁用选项', subname: 'disabled=true', value: 'disabled' },
  { loading: true, name: '加载中选项', value: 'loading' },
  { color: 'var(--destructive)', name: '危险操作', subname: '使用 destructive 语义色', value: 'danger' }
];

const ActionSheetStatus = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="bg-background">
      <View className="p-4">
        <Button
          variant="tonal"
          onPress={() => setShow(true)}
        >
          查看选项状态
        </Button>
      </View>

      <ActionSheet
        closeOnClickAction
        actions={STATUS_ACTIONS}
        cancelText="取消"
        description="禁用与加载中的选项不可点击"
        show={show}
        title="选项状态"
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ActionSheetStatus };
