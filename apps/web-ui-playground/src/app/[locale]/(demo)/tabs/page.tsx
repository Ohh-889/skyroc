import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import Custom from './modules/Custom';
import Fill from './modules/Fill';
import Horizontal from './modules/Horizontal';
import Render from './modules/Render';
import Shape from './modules/Shape';
import Size from './modules/Size';
import Vertical from './modules/Vertical';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('tabs');
}

const TabsPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Horizontal"
      >
        <Horizontal />
      </Card>

      <Card
        split
        title="Vertical"
      >
        <Vertical />
      </Card>

      <Card
        split
        title="Fill: auto"
      >
        <Fill />
      </Card>

      <Card
        split
        title="Shape"
      >
        <Shape />
      </Card>

      <Card
        split
        title="Size"
      >
        <Size />
      </Card>

      <Card
        split
        title="Line Type"
      >
        <Custom />
      </Card>

      <Card
        split
        title="Render"
      >
        <Render />
      </Card>
    </div>
  );
};

export default TabsPage;
