import { TextEllipsis } from '@skyroc/native-ui';
import { View } from 'react-native';

const EMOJI_TEXT =
  '🎉🎊✨🌟💫⭐️🌙☀️🌈🍀🌸🌺🌻🌼🌷💐🍎🍊🍋🍌🍉🍇🍓🫐🥝🍒🍑🥭🍍🥥 后面跟着一段普通文字，用来确认二分裁剪不会把表情截成半个字符。';

const TextEllipsisEmoji = () => {
  return (
    <View className="bg-background p-4">
      <TextEllipsis
        collapseText=" 收起"
        content={EMOJI_TEXT}
        expandText=" 展开"
        rows={2}
      />
    </View>
  );
};

export { TextEllipsisEmoji };
