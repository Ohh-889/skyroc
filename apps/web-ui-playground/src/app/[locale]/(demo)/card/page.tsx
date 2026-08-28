import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import CardBasic from './modules/CardBasic';
import CardOnlyContent from './modules/CardOnlyContent';
import CardSize from './modules/CardSize';
import CardSplit from './modules/CardSplit';
import CardTitleSlot from './modules/CardTitleSlot';
import CardWithExtra from './modules/CardWithExtra';
import CardWithFooter from './modules/CardWithFooter';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('card');
}

const CardPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <CardBasic />
      </Card>

      <Card
        split
        title="With Footer"
      >
        <CardWithFooter />
      </Card>

      <Card
        split
        title="Split"
      >
        <CardSplit />
      </Card>

      <Card
        split
        title="With Extra"
      >
        <CardWithExtra />
      </Card>

      <Card
        split
        title="Title Slots"
      >
        <CardTitleSlot />
      </Card>

      <Card
        split
        title="Only Content"
      >
        <CardOnlyContent />
      </Card>

      <Card
        split
        title="Sizes"
      >
        <CardSize />
      </Card>
    </div>
  );
};

export default CardPage;
