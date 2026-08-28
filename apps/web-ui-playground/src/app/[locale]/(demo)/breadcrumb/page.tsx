import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import BreadcrumbBasic from './modules/BreadcrumbBasic';
import BreadcrumbCustomEllipsis from './modules/BreadcrumbCustomEllipsis';
import BreadcrumbCustomItem from './modules/BreadcrumbCustomItem';
import BreadcrumbCustomSeparator from './modules/BreadcrumbCustomSeparator';
import BreadcrumbEllipsisDemo from './modules/BreadcrumbEllipsis';
import BreadcrumbItemDropdown from './modules/BreadcrumbItemDropdown';
import BreadcrumbLink from './modules/BreadcrumbLink';
import BreadcrumbSize from './modules/BreadcrumbSize';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('breadcrumb');
}

const BreadcrumbPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Default"
      >
        <BreadcrumbBasic />
      </Card>

      <Card
        split
        title="Custom Item"
      >
        <BreadcrumbCustomItem />
      </Card>

      <Card
        split
        title="Custom Separator"
      >
        <BreadcrumbCustomSeparator />
      </Card>

      <Card
        split
        title="Link"
      >
        <BreadcrumbLink />
      </Card>

      <Card
        split
        title="Ellipsis"
      >
        <BreadcrumbEllipsisDemo />
      </Card>

      <Card
        split
        title="Custom Ellipsis"
      >
        <BreadcrumbCustomEllipsis />
      </Card>

      <Card
        split
        title="Item Custom Dropdown"
      >
        <BreadcrumbItemDropdown />
      </Card>

      <Card
        split
        title="Size"
      >
        <BreadcrumbSize />
      </Card>
    </div>
  );
};

export default BreadcrumbPage;
