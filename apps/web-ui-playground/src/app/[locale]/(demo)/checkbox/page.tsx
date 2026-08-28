import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import CheckboxBasic from './modules/CheckboxBasic';
import CheckboxCardDemo from './modules/CheckboxCardDemo';
import CheckboxColor from './modules/CheckboxColor';
import CheckboxDisabled from './modules/CheckboxDisabled';
import CheckboxGroupCardDemo from './modules/CheckboxGroupCardDemo';
import CheckboxGroupDemo from './modules/CheckboxGroupDemo';
import CheckboxIndeterminate from './modules/CheckboxIndeterminate';
import CheckboxSize from './modules/CheckboxSize';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('checkbox');
}

const CheckboxPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <CheckboxBasic />
      </Card>

      <Card
        split
        title="Color"
      >
        <CheckboxColor />
      </Card>

      <Card
        split
        title="Size"
      >
        <CheckboxSize />
      </Card>

      <Card
        split
        title="States"
      >
        <CheckboxIndeterminate />
      </Card>

      <Card
        split
        title="Disabled"
      >
        <CheckboxDisabled />
      </Card>

      <Card
        split
        title="Group"
      >
        <CheckboxGroupDemo />
      </Card>

      <Card
        split
        title="Card"
      >
        <CheckboxCardDemo />
      </Card>

      <Card
        split
        title="Card Group"
      >
        <CheckboxGroupCardDemo />
      </Card>
    </div>
  );
};

export default CheckboxPage;
