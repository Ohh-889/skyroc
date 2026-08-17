import type { PickerOption } from '@skyroc/native-ui';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Form,
  FormComputedField,
  FormItem,
  Input,
  Picker,
  Radio,
  RadioGroup,
  Rate,
  Stepper,
  Switch,
  Text,
  useForm
} from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 单列选项：Picker 的值始终是数组，单列时数组里只有一项 */
const CITIES: PickerOption[] = [
  { label: '杭州', value: 'hangzhou' },
  { label: '宁波', value: 'ningbo' },
  { label: '南京', value: 'nanjing' },
  { label: '苏州', value: 'suzhou' },
  { label: '上海', value: 'shanghai' }
];

const HOBBIES = [
  { label: '阅读', value: 'reading' },
  { label: '运动', value: 'sports' },
  { label: '音乐', value: 'music' }
];

interface ProfileForm {
  /** 出生日期，DatePicker 回传 [年, 月, 日] */
  birthday: string[];
  /** 所在城市，Picker 回传单元素数组 */
  city: string[];
  /** 性别 */
  gender: string;
  /** 兴趣爱好 */
  hobbies: string[];
  /** 是否接收推送 */
  notify: boolean;
  /** 登录密码 */
  password: string;
  /** 手机号 */
  phone: string;
  /** 满意度评分 */
  score: number;
}

interface LayoutForm {
  /** 收货地址 */
  address: string;
  /** 昵称 */
  nickname: string;
  /** 备注 */
  remark: string;
}

interface OrderForm {
  /** 单价 */
  price: string;
  /** 数量 */
  quantity: number;
  /** 合计金额，展示在 Input 里，因此存字符串 */
  total: string;
}

/** PickerValue 组件属性 */
interface PickerValueProps {
  /** 未选择时的占位文案 */
  placeholder?: string;
  /** 已选项的显示文案 */
  value?: string;
}

/** 弹层类字段的行内展示：值由 FormItem 注入给 Picker，这里只负责把选中项渲染成一行文字 */
const PickerValue = (props: PickerValueProps) => {
  const { placeholder = '请选择', value } = props;

  return <Text color={value ? 'foreground' : 'muted'}>{value || placeholder}</Text>;
};

/** Picker 回传的是值数组，行内展示要换回选项文案 */
function resolveCityLabel(values: string[]) {
  const [value] = values;

  return CITIES.find(city => city.value === value)?.label ?? '';
}

/** DatePicker 回传 [年, 月, 日]，拼成 YYYY-MM-DD 展示 */
function formatBirthday(values: string[]) {
  const [year, month, day] = values;

  if (!year || !month || !day) return '';

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

const FormDemo = () => {
  const [cityShow, setCityShow] = useState(false);
  const [birthdayShow, setBirthdayShow] = useState(false);
  const [submitted, setSubmitted] = useState('尚未提交');

  const [profileForm] = useForm<ProfileForm>();
  const [layoutForm] = useForm<LayoutForm>();
  const [orderForm] = useForm<OrderForm>();

  function handleFinish(values: ProfileForm) {
    setSubmitted(JSON.stringify(values));
  }

  function handleFinishFailed() {
    setSubmitted('校验未通过');
  }

  function handleReset() {
    profileForm.resetFields();
    setSubmitted('尚未提交');
  }

  return (
    <ScrollView
      className="flex-1 bg-secondary"
      contentContainerClassName="gap-6 py-4 pb-20"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Form<ProfileForm>
        inset
        form={profileForm}
        title="基本信息"
        // 数组型字段给一个空数组初值：core 在没有值时注入的是空字符串，Picker 这类组件拿到的会是错的形态
        initialValues={{ birthday: [], city: [], hobbies: [], notify: false, score: 0 }}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
      >
        {/* required 只写一次：星号与校验规则同源 */}
        <FormItem<ProfileForm>
          required
          label="手机号"
          name="phone"
          rules={[{ message: '请输入 11 位手机号', pattern: /^1\d{10}$/ }]}
        >
          <Input
            keyboardType="number-pad"
            placeholder="请输入手机号"
            variant="none"
          />
        </FormItem>

        {/* 校验失败时 error 会注入到 Input，边框同步变红 */}
        <FormItem<ProfileForm>
          required
          description="至少 6 位，区分大小写"
          label="登录密码"
          name="password"
          rules={[{ message: '密码至少 6 位', minLength: 6 }]}
        >
          <Input
            placeholder="请输入密码"
            type="password"
            variant="none"
          />
        </FormItem>

        {/* 走 onChange(value) 的控件不需要任何额外配置 */}
        <FormItem<ProfileForm>
          label="性别"
          name="gender"
        >
          <RadioGroup direction="horizontal">
            <Radio name="male">男</Radio>
            <Radio name="female">女</Radio>
          </RadioGroup>
        </FormItem>

        {/*
          弹层类控件：值由 onConfirm 回传，所以 trigger 改成 onConfirm；
          show 由页面持有，整行点击负责打开，触发区因此覆盖标签到箭头的一整行
        */}
        <FormItem<ProfileForm>
          showArrow
          label="所在城市"
          name="city"
          trigger="onConfirm"
          onPress={() => setCityShow(true)}
        >
          <Picker
            columns={CITIES}
            show={cityShow}
            title="选择城市"
            onUpdateShow={setCityShow}
          >
            {args => <PickerValue value={resolveCityLabel(args.value)} />}
          </Picker>
        </FormItem>

        <FormItem<ProfileForm>
          showArrow
          label="出生日期"
          name="birthday"
          trigger="onConfirm"
          onPress={() => setBirthdayShow(true)}
        >
          <DatePicker
            show={birthdayShow}
            title="选择出生日期"
            onUpdateShow={setBirthdayShow}
          >
            {args => (
              <PickerValue
                placeholder="请选择日期"
                value={formatBirthday(args.value)}
              />
            )}
          </DatePicker>
        </FormItem>

        {/* 多选值是数组，控件本身就按数组收发，FormItem 不需要额外转换 */}
        <FormItem<ProfileForm>
          label="兴趣爱好"
          name="hobbies"
        >
          <CheckboxGroup direction="horizontal">
            {HOBBIES.map(hobby => (
              <Checkbox
                key={hobby.value}
                name={hobby.value}
              >
                {hobby.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </FormItem>

        {/* checked / onCheckedChange 形态的控件：改 valuePropName 与 trigger 就能接入 */}
        <FormItem<ProfileForm>
          classNames={{ control: 'items-end' }}
          label="接收推送"
          name="notify"
          trigger="onCheckedChange"
          valuePropName="checked"
        >
          <Switch />
        </FormItem>

        <FormItem<ProfileForm>
          classNames={{ control: 'items-end' }}
          label="满意度"
          name="score"
        >
          <Rate />
        </FormItem>
      </Form>

      <View className="flex-row gap-3 px-4">
        <Button
          className="flex-1"
          color="primary"
          variant="solid"
          onPress={() => profileForm.submit()}
        >
          提交
        </Button>

        <Button
          className="flex-1"
          color="primary"
          variant="outline"
          onPress={handleReset}
        >
          重置
        </Button>
      </View>

      <Text
        className="px-4"
        color="muted"
      >
        提交结果：{submitted}
      </Text>

      <Form<LayoutForm>
        inset
        form={layoutForm}
        title="标签位置与尺寸"
      >
        {/* 长内容用 labelAlign="top"，标签压在输入区上方 */}
        <FormItem<LayoutForm>
          required
          description="送货上门时使用"
          label="收货地址"
          labelAlign="top"
          name="address"
          rules={[{ message: '请填写收货地址', required: true }]}
        >
          <Input
            placeholder="请输入详细地址"
            variant="none"
          />
        </FormItem>

        <FormItem<LayoutForm>
          label="昵称"
          labelWidth={72}
          name="nickname"
          size="sm"
        >
          <Input
            placeholder="小号行高"
            variant="none"
          />
        </FormItem>

        <FormItem<LayoutForm>
          label="备注"
          name="remark"
          size="lg"
        >
          <Input
            placeholder="大号行高"
            variant="none"
          />
        </FormItem>
      </Form>

      <Form<OrderForm>
        inset
        form={orderForm}
        initialValues={{ price: '99', quantity: 1 }}
        title="计算字段"
      >
        <FormItem<OrderForm>
          label="单价"
          name="price"
        >
          <Input
            keyboardType="decimal-pad"
            placeholder="请输入单价"
            variant="none"
          />
        </FormItem>

        <FormItem<OrderForm>
          label="数量"
          name="quantity"
        >
          <Stepper min={1} />
        </FormItem>

        {/* 合计由单价与数量推出，字段本身只读；RN 的 TextInput 只接受字符串，算完要转成字符串 */}
        <FormComputedField<OrderForm>
          deps={['price', 'quantity']}
          description="随单价与数量自动重算"
          label="合计"
          name="total"
          compute={get => (Number(get('price') || 0) * Number(get('quantity') || 0)).toFixed(2)}
        >
          <Input variant="none" />
        </FormComputedField>
      </Form>
    </ScrollView>
  );
};

export { FormDemo };
