import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import NumberInputBase from './modules/NumberInputBase';
import NumberInputCenter from './modules/NumberInputCenter';
import NumberInputClearable from './modules/NumberInputClearable';
import NumberInputSlot from './modules/NumberInputSlot';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('number-input');
}

const NumberInputPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Base"
      >
        <NumberInputBase />
      </Card>

      <Card
        split
        title="Center"
      >
        <NumberInputCenter />
      </Card>

      <Card
        split
        title="Slot"
      >
        <NumberInputSlot />
      </Card>

      <Card
        split
        title="Clearable"
      >
        <NumberInputClearable />
      </Card>
    </div>
  );
};

export default NumberInputPage;
