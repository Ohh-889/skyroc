import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import Default from './modules/Default';
import ResizableHorizontal from './modules/ResizableHorizontal';
import ResizableSize from './modules/ResizableSize';
import ResizableVertical from './modules/ResizableVertical';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('resizable');
}

const ResizablePage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Horizontal"
      >
        <ResizableHorizontal />
      </Card>

      <Card
        split
        title="Vertical"
      >
        <ResizableVertical />
      </Card>

      <Card
        split
        title="Size"
      >
        <ResizableSize />
      </Card>

      <Card
        split
        title="Nested"
      >
        <Default />
      </Card>
    </div>
  );
};

export default ResizablePage;
