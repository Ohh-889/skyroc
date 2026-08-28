import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import SegmentBasic from './modules/SegmentBasic';
import SegmentDisabled from './modules/SegmentDisabled';
import SegmentOrientation from './modules/SegmentOrientation';
import SegmentShape from './modules/SegmentShape';
import SegmentSize from './modules/SegmentSize';
import SegmentType from './modules/SegmentType';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('segment');
}

const SegmentPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <SegmentBasic />
      </Card>

      <Card
        split
        title="Orientation"
      >
        <SegmentOrientation />
      </Card>

      <Card
        split
        title="Shape"
      >
        <SegmentShape />
      </Card>

      <Card
        split
        title="Size"
      >
        <SegmentSize />
      </Card>

      <Card
        split
        title="Type"
      >
        <SegmentType />
      </Card>

      <Card
        split
        title="Disabled"
      >
        <SegmentDisabled />
      </Card>
    </div>
  );
};

export default SegmentPage;
