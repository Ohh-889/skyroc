import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import HoverCardArrow from './modules/HoverCardArrow';
import HoverCardBasic from './modules/HoverCardBasic';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('hover-card');
}

const HoverCardPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Default"
      >
        <HoverCardBasic />
      </Card>

      <Card
        split
        title="With Arrow"
      >
        <HoverCardArrow />
      </Card>
    </div>
  );
};

export default HoverCardPage;
