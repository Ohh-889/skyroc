import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import ActionAsSelected from './modules/ActionAsSelected';
import Controlled from './modules/Controlled';
import Default from './modules/Default';
import Shape from './modules/Shape';
import ShowEdges from './modules/ShowEdges';
import ShowFirstLast from './modules/ShowFirstLast';
import Size from './modules/Size';
import Variant from './modules/Variant';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('pagination');
}

const PaginationPage = () => {
  return (
    <div className="flex-c gap-4">
      <Default />
      <Variant />
      <Size />
      <Shape />
      <ShowEdges />
      <ShowFirstLast />
      <ActionAsSelected />
      <Controlled />
    </div>
  );
};

export default PaginationPage;
