import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import AllSeparator from './modules/AllSeparator';
import Controlled from './modules/Controlled';
import Default from './modules/Default';
import DefaultValue from './modules/DefaultValue';
import Disabled from './modules/Disabled';
import DisabledOption from './modules/DisabledOption';
import GroupOption from './modules/GroupOption';
import PositionItemAligned from './modules/PositionItemAligned';
import SelectCustom from './modules/SelectCustom';
import SelectSize from './modules/SelectSize';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('select');
}

const SelectPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Basic"
      >
        <Default />
      </Card>

      <Card
        split
        title="Controlled"
      >
        <Controlled />
      </Card>

      <Card
        split
        title="With default value"
      >
        <DefaultValue />
      </Card>

      <Card
        split
        title="Separator"
      >
        <AllSeparator />
      </Card>

      <Card
        split
        title="Group Option"
      >
        <GroupOption />
      </Card>

      <Card
        split
        title="Position Item Aligned"
      >
        <PositionItemAligned />
      </Card>

      <Card
        split
        title="Size"
      >
        <SelectSize />
      </Card>

      <Card
        split
        title="Custom"
      >
        <SelectCustom />
      </Card>

      <Card
        split
        title="Disabled select"
      >
        <Disabled />
      </Card>

      <Card
        split
        title="Disabled option"
      >
        <DisabledOption />
      </Card>
    </div>
  );
};

export default SelectPage;
