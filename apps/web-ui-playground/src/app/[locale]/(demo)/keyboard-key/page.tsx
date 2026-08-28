import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import KeyboardKeyBase from './modules/KeyboardKeyBase';
import KeyboardKeySize from './modules/KeyboardKeySize';
import KeyboardKeyVariants from './modules/KeyboardKeyVariants';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('keyboard-key');
}

const KeyboardKeyPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Base"
      >
        <KeyboardKeyBase />
      </Card>

      <Card
        split
        title="Size"
      >
        <KeyboardKeySize />
      </Card>

      <Card
        split
        title="Variant"
      >
        <KeyboardKeyVariants />
      </Card>
    </div>
  );
};

export default KeyboardKeyPage;
