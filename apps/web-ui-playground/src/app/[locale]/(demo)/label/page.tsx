import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import LabelBasic from './modules/LabelBasic';
import LabelDisabled from './modules/LabelDisabled';
import LabelRequired from './modules/LabelRequired';
import LabelSize from './modules/LabelSize';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('label');
}

const LabelPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <LabelBasic />
      </Card>

      <Card
        split
        title="Size"
      >
        <LabelSize />
      </Card>

      <Card
        split
        title="Required"
      >
        <LabelRequired />
      </Card>

      <Card
        split
        title="Disabled"
      >
        <LabelDisabled />
      </Card>
    </div>
  );
};

export default LabelPage;
