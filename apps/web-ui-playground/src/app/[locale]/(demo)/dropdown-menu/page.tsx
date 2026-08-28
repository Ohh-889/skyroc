import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import DropdownMenuBasic from './modules/DropdownMenuBasic';
import DropdownMenuCheckbox from './modules/DropdownMenuCheckbox';
import DropdownMenuMix from './modules/DropdownMenuMix';
import DropdownMenuRadio from './modules/DropdownMenuRadio';
import DropdownMenuWithArrow from './modules/DropdownMenuWithArrow';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('dropdown-menu');
}

const DropdownMenuPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <DropdownMenuBasic />
      </Card>

      <Card
        split
        title="With Arrow"
      >
        <DropdownMenuWithArrow />
      </Card>

      <Card
        split
        title="Checkbox"
      >
        <DropdownMenuCheckbox />
      </Card>

      <Card
        split
        title="Radio"
      >
        <DropdownMenuRadio />
      </Card>

      <Card
        split
        title="Mix"
      >
        <DropdownMenuMix />
      </Card>
    </div>
  );
};

export default DropdownMenuPage;
