import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import IconBasic from './modules/IconBasic';
import IconColor from './modules/IconColor';
import IconSize from './modules/IconSize';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('icon');
}

const IconPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <IconBasic />
      </Card>

      <Card
        split
        title="Size"
      >
        <IconSize />
      </Card>

      <Card
        split
        title="Color"
      >
        <IconColor />
      </Card>
    </div>
  );
};

export default IconPage;
