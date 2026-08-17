import { Pressable, View } from 'react-native';
import { cn } from '@skyroc/utils';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from '../divider/Divider';
import { Sheet } from '../sheet/Sheet';
import { Text } from '../text/Typography';
import { shareSheetVariants } from './share-sheet-variants';
import type { ShareSheetOption, ShareSheetProps } from './types';

/** 分享面板组件 */
const ShareSheet = (props: ShareSheetProps) => {
  const {
    cancelText,
    className,
    classNames,
    closeable = true,
    description,
    onCancel,
    onSelect,
    onUpdateShow,
    options = [],
    show,
    title
  } = props;

  const slots = shareSheetVariants();

  /** 判断是否为多行选项 */

  const isMultiRow = options.length > 0 && Array.isArray(options[0]);

  function handleCancel() {
    onCancel?.();
    onUpdateShow?.(false);
  }

  function renderOption(option: ShareSheetOption, index: number) {
    return (
      <Pressable
        key={index}
        className={cn(slots.option(), classNames?.option)}
        onPress={() => onSelect?.(option, index)}
      >
        <View className={cn(slots.optionIcon(), classNames?.optionIcon)}>{option.icon}</View>
        <Text className={cn(slots.optionName(), classNames?.optionName)}>{option.name}</Text>
        {option.description ? (
          <Text className={cn(slots.optionDescription(), classNames?.optionDescription)}>{option.description}</Text>
        ) : null}
      </Pressable>
    );
  }

  function renderRow(row: ShareSheetOption[], showBorder: boolean) {
    return (
      <View key={showBorder ? 'border' : 'first'}>
        {showBorder && <Divider className="my-0" />}
        <ScrollView
          horizontal
          contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 16 }}
          showsHorizontalScrollIndicator={false}
        >
          {row.map((option, index) => renderOption(option, index))}
        </ScrollView>
      </View>
    );
  }

  function renderOptions() {
    if (isMultiRow) {
      return (options as ShareSheetOption[][]).map((row, rowIndex) => renderRow(row, rowIndex > 0));
    }
    return renderRow(options as ShareSheetOption[], false);
  }

  return (
    <Sheet
      closeable={closeable}
      description={description}
      show={show}
      className={className}
      title={title}
      onUpdateShow={onUpdateShow}
    >
      {renderOptions()}

      {cancelText ? (
        <>
          <View className={cn(slots.cancelGap(), classNames?.cancelGap)} />
          <Pressable
            className={cn(slots.cancel(), classNames?.cancel)}
            onPress={handleCancel}
          >
            <Text className="text-base text-foreground">{cancelText}</Text>
          </Pressable>
        </>
      ) : null}
    </Sheet>
  );
};

export { ShareSheet };
