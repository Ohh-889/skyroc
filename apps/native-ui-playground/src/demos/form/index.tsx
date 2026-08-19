import { ScrollView } from 'react-native';
import { FormBasic } from './FormBasic';
import { FormComputed } from './FormComputed';
import { FormLayout } from './FormLayout';

/**
 * Form 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/form/FormComputed" />）， 所以这里只负责串场，不要把示例代码写回本文件。
 *
 * 这里不套 Section：每个 Form 自带 title，inset 形态又依赖 secondary 底色，再包一层卡片会顶两层标题。
 */
const FormDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-secondary"
      contentContainerClassName="pb-20"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <FormBasic />
      <FormLayout />
      <FormComputed />
    </ScrollView>
  );
};

export { FormDemo };
