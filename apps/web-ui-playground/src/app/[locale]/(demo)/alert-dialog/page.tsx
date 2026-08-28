import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import AlertDialogCustomIcon from './modules/AlertDialogCustomIcon';
import AlertDialogDestructive from './modules/AlertDialogDestructive';
import AlertDialogInformation from './modules/AlertDialogInformation';
import AlertDialogSize from './modules/AlertDialogSize';
import AlertDialogSuccess from './modules/AlertDialogSuccess';
import AlertDialogWarning from './modules/AlertDialogWarning';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('alert-dialog');
}

const AlertDialogPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Destructive"
      >
        <AlertDialogDestructive />
      </Card>

      <Card
        split
        title="Success"
      >
        <AlertDialogSuccess />
      </Card>

      <Card
        split
        title="Warning"
      >
        <AlertDialogWarning />
      </Card>

      <Card
        split
        title="Information"
      >
        <AlertDialogInformation />
      </Card>

      <Card
        split
        title="Size"
      >
        <AlertDialogSize />
      </Card>

      <Card
        split
        title="Custom Icon"
      >
        <AlertDialogCustomIcon />
      </Card>
    </div>
  );
};

export default AlertDialogPage;
