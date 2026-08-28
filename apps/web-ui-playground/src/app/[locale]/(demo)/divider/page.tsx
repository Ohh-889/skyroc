import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import DividerAlign from './modules/DividerAlign';
import DividerBasic from './modules/DividerBasic';
import DividerBorder from './modules/DividerBorder';
import DividerVertical from './modules/DividerVertical';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('divider');
}

const DividerPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Horizontal"
      >
        <DividerBasic />
      </Card>

      <Card
        split
        title="Vertical"
      >
        <DividerVertical />
      </Card>

      <Card
        split
        title="Align"
      >
        <DividerAlign />
      </Card>

      <Card
        split
        title="Border"
      >
        <DividerBorder />
      </Card>
    </div>
  );
};

export default DividerPage;
