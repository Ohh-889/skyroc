import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import CarouselAutoplay from './modules/CarouselAutoplay';
import CarouselBasic from './modules/CarouselBasic';
import CarouselMultiple from './modules/CarouselMultiple';
import CarouselVertical from './modules/CarouselVertical';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('carousel');
}

const CarouselPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <CarouselBasic />
      </Card>

      <Card
        split
        title="Multiple Items"
      >
        <CarouselMultiple />
      </Card>

      <Card
        split
        title="Autoplay Plugin"
      >
        <CarouselAutoplay />
      </Card>

      <Card
        split
        title="Vertical"
      >
        <CarouselVertical />
      </Card>
    </div>
  );
};

export default CarouselPage;
