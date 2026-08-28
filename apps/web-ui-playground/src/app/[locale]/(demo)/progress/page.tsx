import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import Color from './modules/Color';
import ProgressAnimated from './modules/ProgressAnimated';
import ProgressBasic from './modules/ProgressBasic';
import Size from './modules/Size';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('progress');
}

const ProgressPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <ProgressBasic />
      </Card>

      <Card
        split
        title="Color"
      >
        <Color />
      </Card>

      <Card
        split
        title="Size"
      >
        <Size />
      </Card>

      <Card
        split
        title="Animated"
      >
        <ProgressAnimated />
      </Card>
    </div>
  );
};

export default ProgressPage;
