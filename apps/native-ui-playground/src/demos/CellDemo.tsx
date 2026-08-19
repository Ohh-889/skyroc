import { Cell, CellGroup, Text } from '@skyroc/native-ui';
import { Alert, ScrollView, View } from 'react-native';

function handlePress(label: string) {
  Alert.alert(label, '列表项已点击');
}

const CellDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell title="单行标题" />
        <Cell
          subtitle="用于补充说明当前内容"
          title="带描述信息"
        />
        <Cell
          subtitle="标题、描述与右侧内容可以同时使用"
          title="完整信息"
          trailing="详情"
        />
      </View>

      {/* 点击与箭头 */}
      <Text className="mb-4 text-lg font-semibold">点击与箭头</Text>
      <Text className="mb-3 text-sm text-muted-foreground">传入点击事件后默认显示右箭头</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          title="可点击列表项"
          onPress={() => handlePress('可点击列表项')}
        />
        <Cell
          showArrow
          subtitle="也可以通过 showArrow 显式控制"
          title="显式显示箭头"
          onPress={() => handlePress('显式显示箭头')}
        />
      </View>

      {/* 左侧内容 */}
      <Text className="mb-4 text-lg font-semibold">左侧内容</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          leading={
            <View className="size-9 items-center justify-center rounded-xl bg-primary/10">
              <Text className="text-sm font-semibold text-primary">A</Text>
            </View>
          }
          subtitle="leading 可以承载图标"
          title="图标入口"
        />
        <Cell
          leading={
            <View className="size-9 items-center justify-center rounded-full bg-success/10">
              <Text className="text-sm font-semibold text-success">林</Text>
            </View>
          }
          title="头像入口"
          trailing="在线"
        />
      </View>

      {/* 右侧内容与箭头方向 */}
      <Text className="mb-4 text-lg font-semibold">右侧内容与箭头方向</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          showArrow
          title="右箭头"
          onPress={() => handlePress('右箭头')}
        />
        <Cell
          showArrow
          arrowDirection="down"
          title="下箭头"
          trailing="展开"
          onPress={() => handlePress('下箭头')}
        />
        <Cell
          showArrow
          arrowDirection="up"
          title="上箭头"
          trailing="收起"
          onPress={() => handlePress('上箭头')}
        />
      </View>

      {/* 分组 */}
      <Text className="mb-4 text-lg font-semibold">分组</Text>
      <View className="mb-8">
        <CellGroup
          classNames={{ root: 'border border-border/70 bg-background' }}
          title="账户设置"
        >
          <Cell
            title="个人资料"
            trailing="已完善"
          />
          <Cell
            title="安全设置"
            trailing="正常"
          />
          <Cell
            showArrow
            title="更多设置"
            onPress={() => handlePress('更多设置')}
          />
        </CellGroup>
      </View>

      {/* 内嵌分组 */}
      <Text className="mb-4 text-lg font-semibold">内嵌分组</Text>
      <Text className="mb-3 text-sm text-muted-foreground">inset 会为分组内容增加左右留白</Text>
      <View className="-mx-6 mb-8">
        <CellGroup
          inset
          classNames={{ root: 'border border-border/70 bg-background' }}
          title="通知设置"
        >
          <Cell
            title="系统通知"
            trailing="已开启"
          />
          <Cell
            title="活动提醒"
            trailing="仅重要"
          />
          <Cell
            showArrow
            title="通知偏好"
            onPress={() => handlePress('通知偏好')}
          />
        </CellGroup>
      </View>

      {/* 尺寸 */}
      <Text className="mb-4 text-lg font-semibold">尺寸</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          size="sm"
          subtitle="Small"
          title="紧凑尺寸"
        />
        <Cell
          size="md"
          subtitle="Medium"
          title="默认尺寸"
        />
        <Cell
          size="lg"
          subtitle="Large"
          title="宽松尺寸"
        />
      </View>

      {/* 禁用 */}
      <Text className="mb-4 text-lg font-semibold">禁用</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          disabled
          showArrow
          subtitle="禁用后不会触发点击事件"
          title="暂不可用"
          trailing="Disabled"
          onPress={() => handlePress('暂不可用')}
        />
      </View>
    </ScrollView>
  );
};

export { CellDemo };
