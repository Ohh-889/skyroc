import { Button, Cell, SwipeCell, Text } from '@skyroc/native-ui';
import type { SwipeCellBeforeCloseParams, SwipeCellInstance } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { Alert, View } from 'react-native';

const SwipeCellBeforeClose = () => {
  const [lastDecision, setLastDecision] = useState('—');

  const guardedRef = useRef<SwipeCellInstance>(null);

  function handleBeforeClose({ position }: SwipeCellBeforeCloseParams) {
    return new Promise<boolean>(resolve => {
      Alert.alert('提示', `确定要关闭吗？（来源：${position}）`, [
        {
          onPress: () => {
            setLastDecision(`${position} · 拦下了，保持展开`);
            resolve(false);
          },
          style: 'cancel',
          text: '取消'
        },
        {
          onPress: () => {
            setLastDecision(`${position} · 放行，收起`);
            resolve(true);
          },
          text: '确定'
        }
      ]);
    });
  }

  return (
    <View className="bg-muted">
      <SwipeCell
        beforeClose={handleBeforeClose}
        name="guarded"
        ref={guardedRef}
        trailing={
          <View className="w-16 items-center justify-center bg-destructive">
            <Text className="text-sm text-destructive-foreground">删除</Text>
          </View>
        }
      >
        <Cell
          title="单元格"
          trailing="向左滑开后再试着收起"
        />
      </SwipeCell>
      <View className="mt-3 flex-row items-center gap-3 px-4">
        <Button
          size="sm"
          variant="outline"
          onPress={() => guardedRef.current?.close()}
        >
          关闭
        </Button>
        <Text className="flex-1 text-sm text-muted-foreground">上次结果：{lastDecision}</Text>
      </View>
    </View>
  );
};

export { SwipeCellBeforeClose };
