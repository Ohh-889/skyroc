import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import SwitchBasic from './modules/SwitchBasic';
import SwitchColor from './modules/SwitchColor';
import SwitchControlled from './modules/SwitchControlled';
import SwitchCustom from './modules/SwitchCustom';
import SwitchDisabled from './modules/SwitchDisabled';
import SwitchSize from './modules/SwitchSize';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('switch');
}

const SwitchPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <SwitchBasic />
      </Card>

      <Card
        split
        title="Controlled"
      >
        <SwitchControlled />
      </Card>

      <Card
        split
        title="Color"
      >
        <SwitchColor />
      </Card>

      <Card
        split
        title="Size"
      >
        <SwitchSize />
      </Card>

      <Card
        split
        title="Disabled"
      >
        <SwitchDisabled />
      </Card>

      <Card
        split
        title="Custom"
      >
        <SwitchCustom />
      </Card>
    </div>
  );
};

export default SwitchPage;
