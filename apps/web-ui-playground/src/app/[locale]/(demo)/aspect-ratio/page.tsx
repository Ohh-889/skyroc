import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import AspectRatioBasic from './modules/AspectRatioBasic';
import AspectRatioVariants from './modules/AspectRatioVariants';
import AspectRatioVideo from './modules/AspectRatioVideo';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('aspect-ratio');
}

const AspectRatioPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <AspectRatioBasic />
      </Card>

      <Card
        split
        title="Different Ratios"
      >
        <AspectRatioVariants />
      </Card>

      <Card
        split
        title="Video Embed"
      >
        <AspectRatioVideo />
      </Card>
    </div>
  );
};

export default AspectRatioPage;
