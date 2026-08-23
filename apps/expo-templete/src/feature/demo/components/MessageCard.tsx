import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Avatar, Text } from '@skyroc/native-ui';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { Message } from '../mock-api';
import { MESSAGE_TYPE_META } from './message-meta';

const Icon = withUniwind(MaterialCommunityIcons);

/** 日期组头：一行小标题加一条延伸到底的细线，比纯文字更能把长列表切开 */
export const MessageDayDivider = ({ label }: { label: string }) => (
  <View className="flex-row items-center gap-2 px-1 pb-2 pt-5">
    <Text
      color="muted"
      size="xs"
      weight="semibold"
    >
      {label}
    </Text>

    <View className="h-px flex-1 bg-border/60" />
  </View>
);

/** MessageCard 组件属性 */
export interface MessageCardProps {
  item: Message;

  /** 点击整条时触发，通常用来标记已读 */
  onRead: () => void;
}

/**
 * 一条通知消息。
 *
 * 放在 `feature/demo/components` 而不是某个页面的 `modules/`：消息 tab 和 `/demo/messages` 分属两个路由分组，按约定跨分组复用的组件要上移到 feature 层。
 */
export const MessageCard = (props: MessageCardProps) => {
  const { item, onRead } = props;

  const meta = MESSAGE_TYPE_META[item.type];

  return (
    <Pressable
      onPress={onRead}
      className={`relative overflow-hidden rounded-2xl px-3 py-3 active:opacity-70 ${
        item.read ? 'bg-transparent' : 'bg-primary/5'
      }`}
    >
      {/* 未读的左侧强调条：比单纯加粗字重更容易在快速滚动时扫到 */}
      {item.read ? null : <View className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-primary" />}

      <View className="flex-row gap-3">
        {/* Avatar 的 root 自带 bg-muted，色调要挂在 root 上才盖得住，挂 fallback 槽会被底色压掉 */}
        {item.type === 'system' ? (
          <View className={`size-10 items-center justify-center rounded-full ${meta.tint}`}>
            <Icon
              colorClassName={meta.accent}
              name={meta.icon}
              size={18}
            />
          </View>
        ) : (
          <Avatar
            size="md"
            classNames={{ fallbackText: meta.text, root: meta.tint }}
            fallback={item.sender.slice(-2)}
          />
        )}

        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="flex-shrink"
              numberOfLines={1}
              size="sm"
              weight={item.read ? 'normal' : 'semibold'}
            >
              {item.sender}
            </Text>

            <View className={`rounded px-1.5 py-px ${meta.tint}`}>
              <Text
                className={meta.text}
                size="2xs"
              >
                {meta.label}
              </Text>
            </View>

            <View className="flex-1" />

            <Text
              color="muted"
              size="2xs"
            >
              {item.createdAt}
            </Text>
          </View>

          <Text
            color={item.read ? 'muted' : 'foreground'}
            numberOfLines={2}
            size="sm"
          >
            {item.content}
          </Text>

          {/* 引用块：把消息挂靠的对象单独拎出来，一眼能看出这条通知是从哪来的 */}
          {item.target ? (
            <View className="mt-0.5 flex-row items-center gap-1.5 self-start rounded-lg bg-muted/70 px-2 py-1">
              <Icon
                colorClassName="accent-muted-foreground"
                name="link-variant"
                size={11}
              />

              <Text
                color="muted"
                numberOfLines={1}
                size="2xs"
              >
                {item.target}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};
