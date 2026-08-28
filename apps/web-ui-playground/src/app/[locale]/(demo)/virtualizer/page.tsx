import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import LazyModules from './modules/LazyModules';
import VirtualGridBasic from './modules/VirtualGridBasic';
import VirtualizerHook from './modules/VirtualizerHook';
import VirtualListBasic from './modules/VirtualListBasic';
import VirtualListVariable from './modules/VirtualListVariable';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('virtualizer');
}

const VirtualizerPage = () => {
  return (
    <div className="flex-c gap-4">
      <VirtualListBasic />
      <VirtualListVariable />
      <LazyModules />
      <VirtualGridBasic />
      <VirtualizerHook />
    </div>
  );
};

export default VirtualizerPage;
