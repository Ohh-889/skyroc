import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import MenubarBasic from './modules/MenubarBasic';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('menubar');
}

const MenubarPage = () => {
  return (
    <Card
      split
      title="Menubar"
    >
      <MenubarBasic />
    </Card>
  );
};

export default MenubarPage;
