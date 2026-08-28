import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import InputBasic from './modules/InputBasic';
import InputClearable from './modules/InputClearable';
import InputDisabled from './modules/InputDisabled';
import InputSlot from './modules/InputSlot';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('input');
}

const InputPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Base"
      >
        <InputBasic />
      </Card>

      <Card
        split
        title="Disabled"
      >
        <InputDisabled />
      </Card>

      <Card
        split
        title="Slot"
      >
        <InputSlot />
      </Card>

      <Card
        split
        title="Clearable"
      >
        <InputClearable />
      </Card>
    </div>
  );
};

export default InputPage;
