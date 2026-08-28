import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import AlertColor from './modules/AlertColor';
import AlertComplete from './modules/AlertComplete';
import AlertWithDescription from './modules/AlertDescription';
import AlertWithIcon from './modules/AlertIcon';
import AlertSizeDemo from './modules/AlertSize';
import AlertVariantDemo from './modules/AlertVariant';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('alert');
}

const AlertPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Color"
      >
        <AlertColor />
      </Card>

      <Card
        split
        title="Variant"
      >
        <AlertVariantDemo />
      </Card>

      <Card
        split
        title="With Description"
      >
        <AlertWithDescription />
      </Card>

      <Card
        split
        title="With Icon"
      >
        <AlertWithIcon />
      </Card>

      <Card
        split
        title="Complete Example"
      >
        <AlertComplete />
      </Card>

      <Card
        split
        title="Size"
      >
        <AlertSizeDemo />
      </Card>
    </div>
  );
};

export default AlertPage;
