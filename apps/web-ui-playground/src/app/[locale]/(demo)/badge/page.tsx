import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import BadgeBasic from './modules/BadgeBasic';
import BadgeColor from './modules/BadgeColor';
import BadgeColorWithContent from './modules/BadgeColorWithContent';
import BadgePosition from './modules/BadgePosition';
import BadgeSize from './modules/BadgeSize';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('badge');
}

const BadgePage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <BadgeBasic />
      </Card>

      <Card
        split
        title="Color"
      >
        <BadgeColor />
      </Card>

      <Card
        split
        title="Color With Content"
      >
        <BadgeColorWithContent />
      </Card>

      <Card
        split
        title="Position"
      >
        <BadgePosition />
      </Card>

      <Card
        split
        title="Size"
      >
        <BadgeSize />
      </Card>
    </div>
  );
};

export default BadgePage;
