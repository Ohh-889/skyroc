import { NavBar, Text } from '@skyroc/native-ui';
import { Alert, ScrollView, View } from 'react-native';

const NavBarDemo = () => {
  function handleBack() {
    Alert.alert('点击了返回');
  }

  function handleAction() {
    Alert.alert('点击了操作');
  }

  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="gap-6 py-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <Text className="px-5 text-sm font-semibold text-muted-foreground">基础用法</Text>
        <NavBar
          safeAreaTop={false}
          title="页面标题"
        />
      </View>

      <View className="gap-3">
        <Text className="px-5 text-sm font-semibold text-muted-foreground">返回与操作</Text>
        <NavBar
          leftArrow
          safeAreaTop={false}
          rightText="完成"
          title="编辑资料"
          onLeftPress={handleBack}
          onRightPress={handleAction}
        />
      </View>

      <View className="gap-3">
        <Text className="px-5 text-sm font-semibold text-muted-foreground">文字导航</Text>
        <NavBar
          leftText="取消"
          safeAreaTop={false}
          rightText="保存"
          title="新建内容"
          onLeftPress={handleBack}
          onRightPress={handleAction}
        />
      </View>

      <View className="gap-3">
        <Text className="px-5 text-sm font-semibold text-muted-foreground">无分隔线</Text>
        <NavBar
          border={false}
          leftArrow
          safeAreaTop={false}
          title="沉浸式页面"
          onLeftPress={handleBack}
        />
      </View>
    </ScrollView>
  );
};

export { NavBarDemo };
