import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import ComboboxDemo from './modules/ComboboxDemo';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('combobox');
}

const ComboboxPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        classNames={{ content: 'w-60' }}
        title="Combobox Size"
      >
        <ComboboxDemo />
      </Card>
    </div>
  );
};

export default ComboboxPage;
