import { Text } from '@skyroc/native-ui';
import { ScrollView } from 'react-native';
import { RollingTextBasic } from './RollingTextBasic';
import { RollingTextDirection } from './RollingTextDirection';
import { RollingTextDuration } from './RollingTextDuration';
import { RollingTextManual } from './RollingTextManual';
import { RollingTextStopOrder } from './RollingTextStopOrder';
import { RollingTextTextMode } from './RollingTextTextMode';

/** RollingText 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const RollingTextDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Basic</Text>
      <RollingTextBasic />

      {/* Direction Up */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Direction Up</Text>
      <RollingTextDirection />

      {/* Stop Order RTL */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Stop Order (RTL)</Text>
      <RollingTextStopOrder />

      {/* Custom Duration */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Custom Duration (3s)</Text>
      <RollingTextDuration />

      {/* Text Mode */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Text Mode</Text>
      <RollingTextTextMode />

      {/* Manual Control */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Manual Control</Text>
      <RollingTextManual />
    </ScrollView>
  );
};

export { RollingTextDemo };
