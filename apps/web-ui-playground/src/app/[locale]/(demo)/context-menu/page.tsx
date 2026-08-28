import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import ContextMenuBasic from './modules/ContextMenuBasic';
import ContextMenuCheckbox from './modules/ContextMenuCheckbox';
import ContextMenuMix from './modules/ContextMenuMix';
import ContextMenuRadio from './modules/ContextMenuRadio';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('context-menu');
}

const ContextMenuPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <ContextMenuBasic />
      </Card>

      <Card
        split
        title="Checkbox"
      >
        <ContextMenuCheckbox />
      </Card>

      <Card
        split
        title="Radio"
      >
        <ContextMenuRadio />
      </Card>

      <Card
        split
        title="Mix"
      >
        <ContextMenuMix />
      </Card>
    </div>
  );
};

export default ContextMenuPage;
