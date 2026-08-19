import { Search } from '@skyroc/native-ui';
import { View } from 'react-native';

/** ClassName / classNames 控制 Search 布局，inputClassNames 继续下钻到内部 Input */
const SearchStyles = () => {
  return (
    <View className="bg-background py-2">
      <Search
        showAction
        className="rounded-xl border border-primary-200"
        classNames={{ actionText: 'font-semibold text-destructive', input: 'bg-primary-50', label: 'text-primary' }}
        label="范围"
        placeholder="Search 各 slot"
      />
      <Search
        clearable
        defaultValue="内部 Input 的 control / action"
        inputClassNames={{ action: 'opacity-50', control: 'font-semibold text-primary' }}
      />
    </View>
  );
};

export { SearchStyles };
