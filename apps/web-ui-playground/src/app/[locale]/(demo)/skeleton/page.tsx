import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import CustomSize from './modules/CustomSize';
import DefaultDemo from './modules/DefaultDemo';
import SkeletonAnimation from './modules/SkeletonAnimation';
import SkeletonControl from './modules/SkeletonControl';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('skeleton');
}

const SkeletonPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Skeleton"
      >
        <DefaultDemo />
      </Card>

      <Card
        split
        title="Skeleton Container"
      >
        <CustomSize />
      </Card>

      <Card
        split
        title="Animation"
      >
        <SkeletonAnimation />
      </Card>

      <Card
        split
        title="Control"
      >
        <SkeletonControl />
      </Card>
    </div>
  );
};

export default SkeletonPage;
