import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import TagBasic from './modules/TagBasic';
import TagColor from './modules/TagColor';
import TagShape from './modules/TagShape';
import TagSize from './modules/TagSize';
import TagVariant from './modules/TagVariant';
import TagVariantColors from './modules/TagVariantColors';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('tag');
}

const TagPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <TagBasic />
      </Card>

      <Card
        split
        title="Color"
      >
        <TagColor />
      </Card>

      <Card
        split
        title="Variant"
      >
        <TagVariant />
      </Card>

      <Card
        split
        title="Size"
      >
        <TagSize />
      </Card>

      <Card
        split
        title="Shape"
      >
        <TagShape />
      </Card>

      <Card
        split
        title="Variant x Colors"
      >
        <TagVariantColors />
      </Card>
    </div>
  );
};

export default TagPage;
