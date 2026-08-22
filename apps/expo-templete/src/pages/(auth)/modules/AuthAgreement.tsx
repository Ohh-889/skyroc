import { Checkbox, Text } from '@skyroc/native-ui';

interface AuthAgreementProps {
  /** 是否已经同意登录所需协议 */
  checked: boolean;
  /** 用户切换协议勾选状态时触发 */
  onCheckedChange: (checked: boolean) => void;
}

const AuthAgreement = (props: AuthAgreementProps) => {
  const { checked, onCheckedChange } = props;

  return (
    <Checkbox
      onCheckedChange={onCheckedChange}
      className="mt-4"
      checked={checked}
    >
      <Text className="text-xs leading-6  text-muted-foreground">
        我已阅读并同意 <Text className="text-primary text-xs">用户协议</Text> 和{' '}
        <Text className="text-primary text-xs">隐私政策</Text>
      </Text>
    </Checkbox>
  );
};

export { AuthAgreement };
