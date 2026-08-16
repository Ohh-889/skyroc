import type { NumberKeyboardProps } from '@skyroc/native-ui';
import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 一个演示用例：一颗按钮打开一套键盘配置 */
interface KeyboardCase {
  /** 是否受控。为 false 时不传 value，交给键盘自己持有输入值 */
  controlled: boolean;

  /** 说明这套配置想验证什么 */
  description: string;

  /** 除 value / visible 之外传给 NumberKeyboard 的属性 */
  props: Omit<NumberKeyboardProps, 'value' | 'visible'>;

  /** 列表按钮文案，同时作为用例标识 */
  title: string;
}

const CASES: KeyboardCase[] = [
  {
    controlled: true,
    description: '受控输入，点击键盘外部收起',
    props: {},
    title: '基础用法'
  },
  {
    controlled: true,
    description: '标题栏左右等宽，标题始终居中',
    props: { closeButtonText: '完成', title: '请输入密码' },
    title: '标题与关闭按钮'
  },
  {
    controlled: true,
    description: 'default 主题把额外键放在左下角',
    props: { extraKey: '.', title: '金额' },
    title: '额外按键'
  },
  {
    controlled: true,
    description: '右侧竖排功能区，删除键占 1 份高度、完成键占 3 份',
    props: { closeButtonText: '完成', extraKey: '.', theme: 'custom' },
    title: 'custom 主题'
  },
  {
    controlled: true,
    description: 'custom 主题下 0 两侧各放一个额外键',
    props: { extraKey: ['00', '.'], theme: 'custom' },
    title: '两个额外按键'
  },
  {
    controlled: true,
    description: '每次打开重新洗牌，收起途中顺序不变',
    props: { randomKeyOrder: true, title: '安全键盘' },
    title: '随机键序'
  },
  {
    controlled: true,
    description: '输满 6 位后继续按键不再有反应',
    props: { maxLength: 6, title: '最多 6 位' },
    title: '限制长度'
  },
  {
    controlled: true,
    description: '删除键位置留一个占位格，网格不塌',
    props: { showDeleteKey: false, title: '无删除键' },
    title: '隐藏删除键'
  },
  {
    controlled: true,
    description: 'renderDelete 覆盖退格符号',
    props: { renderDelete: () => <Text>清空</Text>, title: '自定义删除键' },
    title: '自定义删除内容'
  },
  {
    controlled: true,
    description: '键盘不做模态遮挡，此时下方列表仍可直接滚动和点击',
    props: { closeButtonText: '收起', hideOnClickOutside: false, title: '非模态' },
    title: '外部保持可点'
  },
  {
    controlled: false,
    description: '不传 value，输入值由键盘自己持有，onChange 照常抛出完整新值',
    props: { maxLength: 4, title: '非受控' },
    title: '非受控用法'
  },
  {
    controlled: true,
    description: 'classNames 逐槽覆盖：加深面板底色、放大数字、换掉完成键配色',
    props: {
      classNames: {
        confirmKey: 'bg-success',
        keyText: 'text-3xl font-semibold',
        root: 'bg-primary/10'
      },
      closeButtonText: '完成',
      theme: 'custom'
    },
    title: '插槽样式覆盖'
  }
];

const NumberKeyboardDemo = () => {
  // activeCase 和 visible 必须拆成两个 state：关闭时若把 activeCase 一起清掉，
  // 退场动画播到一半属性会当场跳回默认值，主题和标题都会闪一下
  const [activeCase, setActiveCase] = useState(CASES[0]);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');

  function openCase(item: KeyboardCase) {
    setValue('');
    setActiveCase(item);
    setVisible(true);
  }

  function closeCase() {
    setVisible(false);
  }

  function renderCase(item: KeyboardCase) {
    return (
      <View
        className="mb-6 gap-2"
        key={item.title}
      >
        <Text className="text-lg font-semibold">{item.title}</Text>

        <Text color="muted">{item.description}</Text>

        <Button
          variant="outline"
          onPress={() => openCase(item)}
        >
          打开
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6 pb-20"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 gap-1 rounded-xl bg-muted p-4">
          <Text color="muted">当前输入</Text>
          <Text className="text-2xl font-semibold">{value || '—'}</Text>
        </View>

        {CASES.map(renderCase)}
      </ScrollView>

      {/* 键盘常驻，只切 visible：它自己会 Portal 到应用根节点，放在这里不影响定位 */}
      <NumberKeyboard
        {...activeCase.props}
        // 非受控用例刻意不传 value：键盘自己记输入值，这里只负责把 onChange 的结果显示出来
        value={activeCase.controlled ? value : undefined}
        visible={visible}
        onBlur={closeCase}
        onChange={setValue}
        onClose={closeCase}
      />
    </View>
  );
};

export { NumberKeyboardDemo };
