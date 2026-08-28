import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import ScrollAreaCustom from './modules/ScrollAreaCustom';
import ScrollAreaHorizontal from './modules/ScrollAreaHorizontal';
import ScrollAreaSize from './modules/ScrollAreaSize';
import ScrollAreaVertical from './modules/ScrollAreaVertical';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('scroll-area');
}

const ScrollAreaDemo = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Vertical"
      >
        <ScrollAreaVertical />
      </Card>

      <Card
        split
        title="Horizontal"
      >
        <ScrollAreaHorizontal />
      </Card>

      <Card
        split
        title="Size"
      >
        <ScrollAreaSize />
      </Card>

      <Card
        split
        title="Custom"
      >
        <ScrollAreaCustom />
      </Card>
    </div>
  );
};

export default ScrollAreaDemo;
