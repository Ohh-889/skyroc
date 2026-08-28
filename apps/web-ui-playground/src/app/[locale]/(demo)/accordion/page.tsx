import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import AccordionCustom from './modules/AccordionCustom';
import AccordionCustomIcon from './modules/AccordionCustomIcon';
import AccordionMultiple from './modules/AccordionMultiple';
import AccordionSingle from './modules/AccordionSingle';
import AccordionSingleCollapsible from './modules/AccordionSingleCollapsible';
import AccordionSize from './modules/AccordionSize';
import AccordionSlot from './modules/AccordionSlot';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('accordion');
}

const AccordionDemo = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Single"
      >
        <AccordionSingle />
      </Card>

      <Card
        split
        title="Single Collapsible"
      >
        <AccordionSingleCollapsible />
      </Card>

      <Card
        split
        title="Multiple"
      >
        <AccordionMultiple />
      </Card>

      <Card
        split
        title="Slot"
      >
        <AccordionSlot />
      </Card>

      <Card
        split
        title="Custom Icon"
      >
        <AccordionCustomIcon />
      </Card>

      <Card
        split
        title="Custom Styling"
      >
        <AccordionCustom />
      </Card>

      <Card
        split
        title="Size"
      >
        <AccordionSize />
      </Card>
    </div>
  );
};

export default AccordionDemo;
