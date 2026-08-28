import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import CommandBasic from './modules/CommandBasic';
import CommandDialogDemo from './modules/CommandDialog';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('command');
}

const CommandPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Command"
      >
        <CommandBasic />
      </Card>

      <Card
        split
        title="Command Dialog"
      >
        <CommandDialogDemo />
      </Card>
    </div>
  );
};

export default CommandPage;
