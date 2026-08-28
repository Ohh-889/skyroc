import { Card } from '@skyroc/web-ui';
import type { Metadata } from 'next';
import { generateComponentMetadata } from '../components-meta';
import CustomSeparator from './modules/CustomSeparator';
import Disabled from './modules/Disabled';
import InputOtpCustomCount from './modules/InputOtpCustomCount';
import InputOtpDefault from './modules/InputOtpDefault';
import Password from './modules/Password';
import Separator from './modules/Separator';
import UpperCase from './modules/UpperCase';

export async function generateMetadata(): Promise<Metadata> {
  return await generateComponentMetadata('input-otp');
}

const InputOtpPage = () => {
  return (
    <div className="demo-pin-input flex-c gap-4">
      <Card
        split
        title="Default"
      >
        <InputOtpDefault />
      </Card>

      <Card
        split
        title="Custom Input Count"
      >
        <InputOtpCustomCount />
      </Card>

      <Card
        split
        title="UpperCase"
      >
        <UpperCase />
      </Card>

      <Card
        split
        title="Separator"
      >
        <Separator />
      </Card>

      <Card
        split
        title="Custom Separator"
      >
        <CustomSeparator />
      </Card>

      <Card
        split
        title="Password"
      >
        <Password />
      </Card>

      <Card
        split
        title="Disabled"
      >
        <Disabled />
      </Card>
    </div>
  );
};

export default InputOtpPage;
