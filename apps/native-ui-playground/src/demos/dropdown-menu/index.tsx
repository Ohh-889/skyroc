import { Text } from '@skyroc/native-ui';
import { ScrollView } from 'react-native';
import { DropdownMenuBasic } from './DropdownMenuBasic';
import { DropdownMenuControlled } from './DropdownMenuControlled';
import { DropdownMenuDirection } from './DropdownMenuDirection';
import { DropdownMenuDisabled } from './DropdownMenuDisabled';
import { DropdownMenuNoOverlay } from './DropdownMenuNoOverlay';
import { DropdownMenuScrollable } from './DropdownMenuScrollable';
import { DropdownMenuTitle } from './DropdownMenuTitle';

/**
 * DropdownMenu 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/dropdown-menu/DropdownMenuDisabled" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const DropdownMenuDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-3 mt-4 px-4 text-lg font-semibold">基础用法</Text>
      <Text className="mb-3 px-4 text-sm text-muted-foreground">
        标题默认显示当前选中项；展开时点另一个标题会直接换内容，遮罩不会闪一下。
      </Text>
      <DropdownMenuBasic />

      {/* Custom Title */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">自定义标题</Text>
      <DropdownMenuTitle />

      {/* Disabled */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">禁用选项 / 禁用整列</Text>
      <DropdownMenuDisabled />

      {/* Scrollable Panel */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">长列表</Text>
      <Text className="mb-3 px-4 text-sm text-muted-foreground">
        选项超过面板最大高度（默认屏幕的 80%）后面板内部滚动，可用 maxHeight 收紧。
      </Text>
      <DropdownMenuScrollable />

      {/* Controlled + Ref */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">受控用法与命令式控制</Text>
      <DropdownMenuControlled />

      {/* No Overlay */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">无遮罩</Text>
      <DropdownMenuNoOverlay />

      {/* Direction Up */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">向上展开</Text>
      <DropdownMenuDirection />
    </ScrollView>
  );
};

export { DropdownMenuDemo };
