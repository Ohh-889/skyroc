import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import ContentScrollable from './modules/ContentScrollable';
import Side from './modules/Side';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('drawer');
}

const DrawerPage = () => {
  return (
    <Card title="Drawer">
      <div className="flex-c gap-4">
        <Card title="Side">
          <Side />
        </Card>

        <Card title="Content Scrollable">
          <ContentScrollable />
        </Card>
      </div>
    </Card>
  );
};

export default DrawerPage;
