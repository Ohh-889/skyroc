import { Text } from '@skyroc/native-ui';
import { ScrollView } from 'react-native';
import { SwitchAsync } from './SwitchAsync';
import { SwitchBasic } from './SwitchBasic';
import { SwitchColor } from './SwitchColor';
import { SwitchControlled } from './SwitchControlled';
import { SwitchDisabled } from './SwitchDisabled';
import { SwitchLoading } from './SwitchLoading';
import { SwitchSize } from './SwitchSize';
import { SwitchStyles } from './SwitchStyles';
import { SwitchThumb } from './SwitchThumb';
import { SwitchUncontrolled } from './SwitchUncontrolled';

/** Switch 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/switch/SwitchColor" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const SwitchDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pt-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 px-6 text-lg font-semibold">基础用法</Text>
      <SwitchBasic />

      {/* 非受控 */}
      <Text className="mb-4 px-6 text-lg font-semibold">非受控</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        只给 defaultChecked，状态由组件自己维护
      </Text>
      <SwitchUncontrolled />

      {/* 尺寸 */}
      <Text className="mb-4 px-6 text-lg font-semibold">尺寸</Text>
      <SwitchSize />

      {/* 主题色 */}
      <Text className="mb-4 px-6 text-lg font-semibold">主题色</Text>
      <SwitchColor />

      {/* 禁用 */}
      <Text className="mb-4 px-6 text-lg font-semibold">禁用</Text>
      <SwitchDisabled />

      {/* 加载中 */}
      <Text className="mb-4 px-6 text-lg font-semibold">加载中</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        loading 期间同样不可点击，指示器按滑块尺寸缩放
      </Text>
      <SwitchLoading />

      {/* 异步切换 */}
      <Text className="mb-4 px-6 text-lg font-semibold">异步切换</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        受控 + loading：请求成功后才翻转，失败可原样保持
      </Text>
      <SwitchAsync />

      {/* 滑块内容 */}
      <Text className="mb-4 px-6 text-lg font-semibold">滑块内容</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        children 支持文本与节点，会渲染在滑块内部
      </Text>
      <SwitchThumb />

      {/* 自定义样式 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        className 覆盖轨道容器，classNames 细粒度覆盖各 slot
      </Text>
      <SwitchStyles />

      {/* 受控 */}
      <Text className="mb-4 px-6 text-lg font-semibold">受控</Text>
      <SwitchControlled />
    </ScrollView>
  );
};

export { SwitchDemo };
