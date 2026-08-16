import { Button, Cell, SwipeCell, Text } from '@skyroc/native-ui';
import type { SwipeCellBeforeCloseParams, SwipeCellInstance } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

const SwipeCellDemo = () => {
  const [lastDecision, setLastDecision] = useState('—');

  const swipeCellRef = useRef<SwipeCellInstance>(null);
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
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-3 mt-4 px-4 text-lg font-semibold">基础用法</Text>
      <SwipeCell
        leading={
          <View className="w-16 items-center justify-center bg-primary">
            <Text className="text-sm text-primary-foreground">选择</Text>
          </View>
        }
        trailing={
          <>
            <View className="w-16 items-center justify-center bg-primary">
              <Text className="text-sm text-primary-foreground">编辑</Text>
            </View>
            <View className="w-16 items-center justify-center bg-destructive">
              <Text className="text-sm text-destructive-foreground">删除</Text>
            </View>
          </>
        }
      >
        <Cell
          title="单元格"
          trailing="内容"
        />
      </SwipeCell>

      {/* Before Close */}
      <Text className="mb-1 mt-6 px-4 text-lg font-semibold">关闭拦截</Text>
      <Text className="mb-3 px-4 text-sm text-muted-foreground">
        滑动收起、点击内容区、下方「关闭」按钮三条路径都会先弹确认。选「取消」时操作区一直停在展开位不动，不是先关掉再弹回来；选「确定」后才开始收起动画。
        展开动作不受拦截。
      </Text>
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

      {/* Custom Width */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">自定义宽度</Text>
      <SwipeCell
        leading={
          <View className="w-[100px] items-center justify-center bg-primary">
            <Text className="text-sm text-primary-foreground">收藏</Text>
          </View>
        }
        leadingWidth={100}
        trailing={
          <View className="w-[80px] items-center justify-center bg-destructive">
            <Text className="text-sm text-destructive-foreground">删除</Text>
          </View>
        }
        trailingWidth={80}
      >
        <Cell
          title="单元格"
          trailing="自定义宽度"
        />
      </SwipeCell>

      {/* Disabled */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">禁用滑动</Text>
      <SwipeCell
        disabled
        trailing={
          <View className="w-16 items-center justify-center bg-destructive">
            <Text className="text-sm text-destructive-foreground">删除</Text>
          </View>
        }
      >
        <Cell
          title="单元格"
          trailing="禁用状态"
        />
      </SwipeCell>

      {/* Programmatic Control */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">编程式控制</Text>
      <View className="mb-3 flex-row gap-3 px-4">
        <Button
          size="sm"
          onPress={() => swipeCellRef.current?.open('left')}
        >
          打开左侧
        </Button>
        <Button
          size="sm"
          onPress={() => swipeCellRef.current?.open('right')}
        >
          打开右侧
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={() => swipeCellRef.current?.close()}
        >
          关闭
        </Button>
      </View>
      <SwipeCell
        ref={swipeCellRef}
        leading={
          <View className="w-16 items-center justify-center bg-primary">
            <Text className="text-sm text-primary-foreground">选择</Text>
          </View>
        }
        trailing={
          <View className="w-16 items-center justify-center bg-destructive">
            <Text className="text-sm text-destructive-foreground">删除</Text>
          </View>
        }
      >
        <Cell
          title="单元格"
          trailing="编程式控制"
        />
      </SwipeCell>

      {/* Events */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">事件监听</Text>
      <SwipeCell
        name="event-demo"
        trailing={
          <>
            <View className="w-16 items-center justify-center bg-primary">
              <Text className="text-sm text-primary-foreground">编辑</Text>
            </View>
            <View className="w-16 items-center justify-center bg-destructive">
              <Text className="text-sm text-destructive-foreground">删除</Text>
            </View>
          </>
        }
        onClose={({ name, position }) => Alert.alert('关闭', `name: ${name}, position: ${position}`)}
        onOpen={({ name, position }) => Alert.alert('打开', `name: ${name}, position: ${position}`)}
      >
        <Cell
          title="单元格"
          trailing="滑动查看事件"
        />
      </SwipeCell>
    </ScrollView>
  );
};

export { SwipeCellDemo };
