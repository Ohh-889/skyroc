import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import PopoverBasic from './modules/PopoverBasic';
import PopoverClose from './modules/PopoverClose';
import PopoverControlled from './modules/PopoverControlled';
import PopoverPlacement from './modules/PopoverPlacement';
import PopoverSize from './modules/PopoverSize';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('popover');
}

const PopoverPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <PopoverBasic />
      </Card>

      <Card
        split
        title="Placement"
      >
        <PopoverPlacement />
      </Card>

      <Card
        split
        title="Controlled"
      >
        <PopoverControlled />
      </Card>

      <Card
        split
        title="Close"
      >
        <PopoverClose />
      </Card>

      <Card
        split
        title="Size"
      >
        <PopoverSize />
      </Card>
    </div>
  );
};

export default PopoverPage;
