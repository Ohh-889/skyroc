import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import BottomSheetBasic from './modules/DrawerBasic';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('bottom-sheet');
}

const BottomSheetPage = () => {
  return (
    <Card
      split
      title="BottomSheet"
    >
      <BottomSheetBasic />
    </Card>
  );
};

export default BottomSheetPage;
