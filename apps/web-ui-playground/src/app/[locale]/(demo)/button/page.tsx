import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import ButtonColor from './modules/ButtonColor';
import ButtonDisabled from './modules/ButtonDisabled';
import ButtonGroupHorizontal from './modules/ButtonGroupHorizontal';
import ButtonGroupVertical from './modules/ButtonGroupVertical';
import ButtonIconBasic from './modules/ButtonIconBasic';
import ButtonIconFitContent from './modules/ButtonIconFitContent';
import ButtonLoading from './modules/ButtonLoading';
import ButtonShadow from './modules/ButtonShadow';
import ButtonShape from './modules/ButtonShape';
import ButtonSize from './modules/ButtonSize';
import ButtonSlot from './modules/ButtonSlot';
import ButtonVariant from './modules/ButtonVariant';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('button');
}

const ButtonPage = () => {
  return (
    <div className="flex-c gap-4">
      <Card
        split
        title="Color"
      >
        <ButtonColor />
      </Card>

      <Card
        split
        title="Variant"
      >
        <ButtonVariant />
      </Card>

      <Card
        split
        title="Size"
      >
        <ButtonSize />
      </Card>

      <Card
        split
        title="Shape"
      >
        <ButtonShape />
      </Card>

      <Card
        split
        title="Shadow"
      >
        <ButtonShadow />
      </Card>

      <Card
        split
        title="Slot"
      >
        <ButtonSlot />
      </Card>

      <Card
        split
        title="Disabled"
      >
        <ButtonDisabled />
      </Card>

      <Card
        split
        title="Loading"
      >
        <ButtonLoading />
      </Card>

      <Card
        split
        title="Button Group"
      >
        <ButtonGroupHorizontal />
      </Card>

      <Card
        split
        title="Button Group Vertical"
      >
        <ButtonGroupVertical />
      </Card>

      <Card
        split
        title="Button Icon"
      >
        <ButtonIconBasic />
      </Card>

      <Card
        split
        title="Button Icon: fitContent"
      >
        <ButtonIconFitContent />
      </Card>
    </div>
  );
};

export default ButtonPage;
