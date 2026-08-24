import type {
  ActionSheetAction,
  CheckboxGroupCardItem,
  DatePickerFormatter,
  InputProps,
  PickerGroupItem,
  PickerOption,
  RadioGroupCardItem,
  TimePickerFormatter,
  ValidateErrorEntity
} from '@skyroc/native-ui';
import {
  ActionSheet,
  Button,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupCard,
  DatePicker,
  FieldGroup,
  FormComputedField,
  FormItem,
  FormList,
  Input,
  Picker,
  PickerGroup,
  Radio,
  RadioGroup,
  RadioGroupCard,
  Stepper,
  Switch,
  Tag,
  Text,
  TimePicker,
  showSuccessToast,
  useForm,
  useWatch
} from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView as RNKeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { withUniwind } from 'uniwind';
import { DemoHeader } from './modules/DemoHeader';

// 表单页要跟着键盘走，KeyboardAwareScrollView 自带 ScrollView 的属性，包成 Uniwind 版本才能用 className
const KeyboardAwareScrollView = withUniwind(RNKeyboardAwareScrollView);

/**
 * 从组件的 ref prop 反推实例类型。
 *
 * 直接写 useRef<TextInput> 会报错：app 与 native-ui 各自解析到一份 react-native，两份 TextInput 在 TS 眼里是不同的类。 从组件 props 上取就永远跟着 native-ui
 * 那一份走。
 */
type RefInstance<T> = T extends { current: infer I } ? NonNullable<I> : never;

/**
 * 这一页的表单值。
 *
 * 一屏一个表单实例，字段全平铺在这里——真实业务里按页拆，但演示要的就是「一个表单能装下多少种控件」。
 */
interface SolutionForm {
  /** 是否同意协议，单个 Checkbox */
  agreed: boolean;
  /** 预约时段，PickerGroup 每个滚轮各占一格 */
  appointment: string[][];
  /** 个人简介，多行输入 */
  bio: string;
  /** 出生日期，DatePicker 回传的年 / 月 / 日 */
  birthday: string[];
  /** 通知渠道，CheckboxGroup 多选 */
  channels: string[];
  /** 确认密码，与 password 联动校验 */
  confirmPassword: string;
  /** 紧急联系人，FormList 动态增删 */
  contacts: { name: string; phone: string }[];
  /** 邮箱，服务端会回填错误 */
  email: string;
  /** 性别，RadioGroup 单选 */
  gender: string;
  /** 所属行业，Picker 单列 */
  industry: string[];
  /** 发票抬头，只在 needInvoice 打开时出现 */
  invoiceTitle: string;
  /** 是否需要发票，控制 invoiceTitle 的显隐 */
  needInvoice: boolean;
  /** 昵称，服务端会回填错误 */
  nickname: string;
  /** 是否接收推送，Switch */
  notify: boolean;
  /** 登录密码 */
  password: string;
  /** 手机号，带异步查重 */
  phone: string;
  /** 套餐，RadioGroupCard */
  plan: string;
  /** 单价，参与合计计算 */
  price: string;
  /** 购买数量，Stepper，同时参与合计计算 */
  quantity: number;
  /** 所在地区，Picker 级联三列 */
  region: string[];
  /** 每日提醒时间，TimePicker */
  remindAt: string[];
  /** 增值服务，CheckboxGroupCard 多选 */
  services: string[];
  /** 了解渠道，ActionSheet 单选 */
  source: string;
  /** 兴趣标签，自己用 Tag 拼的控件 */
  tags: string[];
  /** 合计金额，由单价 × 数量推出，只读 */
  total: string;
}

/** 会被服务端打回的字段 */
type ServerErrorField = 'email' | 'nickname';

/** 一条服务端错误。记下出错时的值，用户一改动这个字段错误就自动失效 */
interface ServerError {
  /** 错误文案 */
  message: string;
  /** 触发该错误时字段的值 */
  value: string;
}

/** 未选中时的占位文案 */
const PLACEHOLDER = '请选择';

/** 把 Date 归一化成 YYYY-MM-DD */
function formatDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
}

/** 未来 7 天，作为预约日期那一列的选项 */
function buildDateOptions(): PickerOption[] {
  const today = new Date();

  return Array.from({ length: 7 }, (___, index) => {
    const date = new Date(today);

    date.setDate(today.getDate() + index);

    const value = formatDate(date);

    return { label: index === 0 ? `今天（${value.slice(5)}）` : value.slice(5), value };
  });
}

const APPOINTMENT_DATES = buildDateOptions();

const APPOINTMENT_SLOTS: PickerOption[] = [
  { label: '上午 09:00 – 12:00', value: 'am' },
  { label: '下午 13:00 – 17:00', value: 'pm' },
  { label: '晚上 18:00 – 21:00', value: 'night' }
];

/** PickerGroup 的两个滚轮：一个选日期，一个选时段 */
const APPOINTMENT_PICKERS: PickerGroupItem[] = [
  { columns: APPOINTMENT_DATES, title: '日期' },
  { columns: APPOINTMENT_SLOTS, title: '时段' }
];

const INDUSTRIES: PickerOption[] = [
  { label: '互联网 / 软件', value: 'internet' },
  { label: '金融 / 保险', value: 'finance' },
  { label: '医疗 / 健康', value: 'medical' },
  { label: '教育 / 培训', value: 'education' },
  { label: '制造 / 供应链', value: 'manufacture' }
];

/** 级联三列：省 → 市 → 区 */
const REGIONS: PickerOption[] = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang' },
          { label: '余杭区', value: 'yuhang' }
        ]
      },
      {
        label: '宁波',
        value: 'ningbo',
        children: [
          { label: '海曙区', value: 'haishu' },
          { label: '江北区', value: 'jiangbei' }
        ]
      }
    ]
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [
          { label: '玄武区', value: 'xuanwu' },
          { label: '鼓楼区', value: 'gulou' }
        ]
      },
      {
        label: '苏州',
        value: 'suzhou',
        children: [
          { label: '姑苏区', value: 'gusu' },
          { label: '虎丘区', value: 'huqiu' }
        ]
      }
    ]
  }
];

const SOURCE_ACTIONS: ActionSheetAction[] = [
  { name: '应用商店', value: 'store' },
  { name: '朋友推荐', value: 'friend' },
  { name: '社交媒体', value: 'social' },
  { name: '线下活动', value: 'offline' }
];

const PLAN_ITEMS: RadioGroupCardItem<string>[] = [
  { description: '每月 ¥0，基础功能', label: '免费版', value: 'free' },
  { description: '每月 ¥29，去广告 + 云同步', label: '标准版', value: 'standard' },
  { description: '每月 ¥99，含团队协作', label: '专业版', value: 'pro' }
];

const SERVICE_ITEMS: CheckboxGroupCardItem<string>[] = [
  { description: '7×24 小时人工响应', label: '专属客服', value: 'support' },
  { description: '每月一次上门检修', label: '上门服务', value: 'onsite' },
  { description: '延长至 3 年', label: '延保', value: 'warranty' }
];

/** 自定义 Tag 控件的可选项 */
const TAG_OPTIONS = [
  { label: '摄影', value: 'photo' },
  { label: '露营', value: 'camp' },
  { label: '骑行', value: 'bike' },
  { label: '手冲咖啡', value: 'coffee' },
  { label: '机械键盘', value: 'keyboard' }
] as const;

/** 日期各列的中文单位 */
const DATE_COLUMN_UNITS = { day: '日', month: '月', year: '年' };

/** 给日期列补上中文单位 */
const DATE_FORMATTER: DatePickerFormatter = (type, option) => ({
  ...option,
  label: `${option.label}${DATE_COLUMN_UNITS[type]}`
});

/** 时间各列的中文单位 */
const TIME_COLUMN_UNITS = { hour: '时', minute: '分', second: '秒' };

/** 给时间列补上中文单位 */
const TIME_FORMATTER: TimePickerFormatter = (type, option) => ({
  ...option,
  label: `${option.label}${TIME_COLUMN_UNITS[type]}`
});

const INITIAL_VALUES: SolutionForm = {
  agreed: false,
  appointment: [[APPOINTMENT_DATES[0]?.value ?? ''], ['am']],
  birthday: ['1998', '06', '15'],
  bio: '',
  channels: ['push'],
  confirmPassword: '',
  contacts: [{ name: '', phone: '' }],
  email: '',
  gender: 'male',
  industry: [],
  invoiceTitle: '',
  needInvoice: false,
  nickname: '',
  notify: true,
  password: '',
  phone: '',
  plan: 'standard',
  price: '99',
  quantity: 1,
  region: [],
  remindAt: ['09', '00'],
  services: [],
  source: '',
  tags: [],
  total: ''
};

/** 单列选择器的展示文本 */
function resolveOptionLabel(options: readonly PickerOption[], values: string[]) {
  return options.find(item => item.value === values[0])?.label;
}

/** 顺着 children 一层层往下找，把级联选中的 value 还原成各级 label */
function resolveCascadeLabels(options: readonly PickerOption[], values: string[]) {
  const labels: string[] = [];

  let level: PickerOption[] | undefined = options as PickerOption[];

  for (const value of values) {
    // 显式标注一次类型：level 会被 hit.children 回写，不标注 TS 会判成循环推断
    const hit: PickerOption | undefined = level?.find(item => item.value === value);

    if (!hit) break;

    labels.push(hit.label ?? value);
    level = hit.children;
  }

  return labels.join(' / ');
}

/** 预约时段的展示文本：日期与时段两格都选齐了才算选好 */
function resolveAppointmentLabel(values: string[][]) {
  const date = resolveOptionLabel(APPOINTMENT_DATES, values[0] ?? []);
  const slot = resolveOptionLabel(APPOINTMENT_SLOTS, values[1] ?? []);

  return date && slot ? `${date} ${slot}` : undefined;
}

/** ActionSheet 选中项的展示文本，本页的 name 都是纯文本 */
function resolveActionLabel(value: string) {
  const hit = SOURCE_ACTIONS.find(item => item.value === value);

  return typeof hit?.name === 'string' ? hit.name : undefined;
}

/** 假的提交接口：昵称叫 admin、邮箱是 QQ 的一律打回，用来演示服务端错误回填 */
async function submitProfile(values: SolutionForm) {
  await new Promise(resolve => {
    setTimeout(resolve, 800);
  });

  const errors: Partial<Record<ServerErrorField, ServerError>> = {};

  if (values.nickname.trim() === 'admin') {
    errors.nickname = { message: '该昵称已被占用，换一个吧', value: values.nickname };
  }

  if (values.email.endsWith('@qq.com')) {
    errors.email = { message: '暂不支持 QQ 邮箱', value: values.email };
  }

  return errors;
}

/** 假的手机号查重接口，配 rule 的 debounceMs 用 */
async function checkPhoneRegistered(value: string) {
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return value === '13800000000';
}

/** PickedText 组件属性 */
interface PickedTextProps {
  /** 已选中的展示文本，为空时显示占位文案并用弱化色 */
  label?: string;
}

/** 弹层选择器那一格的展示文本，六个选择器共用同一套「选了 / 没选」表现 */
const PickedText = (props: PickedTextProps) => {
  const { label } = props;

  return (
    <Text className={label ? 'text-base text-foreground' : 'text-base text-muted-foreground'}>
      {label || PLACEHOLDER}
    </Text>
  );
};

/** TagSelect 组件属性 */
interface TagSelectProps {
  /** 选中值变化。签名与 onChange(value) 约定一致，因此不用给 FormItem 配 trigger */
  onChange?: (value: string[]) => void;
  /** 可选标签 */
  options: readonly { label: string; value: string }[];
  /** 当前选中的标签值 */
  value?: string[];
}

/**
 * 用 Tag 拼出来的多选控件。
 *
 * 表单接的不是某个具体组件，而是 `value` / `onChange` 这条约定——守约的组件都能直接塞进 FormItem，自己写的也一样。
 */
const TagSelect = (props: TagSelectProps) => {
  const { onChange, options, value = [] } = props;

  function handleToggle(next: string) {
    onChange?.(value.includes(next) ? value.filter(item => item !== next) : [...value, next]);
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map(option => {
        const selected = value.includes(option.value);

        return (
          <Pressable
            key={option.value}
            onPress={() => handleToggle(option.value)}
          >
            <Tag
              shape="pill"
              size="lg"
              color={selected ? 'primary' : 'muted'}
              variant={selected ? 'solid' : 'outline'}
            >
              {option.label}
            </Tag>
          </Pressable>
        );
      })}
    </View>
  );
};

/** Section 组件属性 */
interface SectionProps {
  /** 区块内容 */
  children: ReactNode;
  /** 一句话说明这一组演示的是哪种接线方式 */
  description: string;
  /** 区块标题 */
  title: string;
}

/** 演示区块。标题与说明在外，控件在内，方便一屏里横向对照各种接法 */
const Section = (props: SectionProps) => {
  const { children, description, title } = props;

  return (
    <View className="gap-2">
      <View className="gap-1 px-1 pt-2">
        <Text
          size="lg"
          weight="semibold"
        >
          {title}
        </Text>

        <Text
          color="muted"
          size="sm"
        >
          {description}
        </Text>
      </View>

      {children}
    </View>
  );
};

/**
 * 表单解决方案。
 *
 * 把 `@skyroc/native-ui` 的表单体系过一遍：文本输入、开关与单选多选、卡片式选择、六种弹层选择器、计算字段、 动态字段，加上字段级 / 表单级 / 异步 / 联动 / 服务端回填五种校验。
 *
 * 三条贯穿全页的规则，看别的都从这里推：
 *
 * 1. **表单只认 `value` + `onChange` 这条约定**。守约的控件（Input / RadioGroup / CheckboxGroup / Stepper / TagSelect） 直接放进
 *    FormItem；不守约的用 `valuePropName` 改值属性名、`trigger` 改变更回调名（Switch 是 `checked` / `onCheckedChange`，Picker 是 `value` /
 *    `onConfirm`）。
 * 2. **全页只有一个表单根**。这里用 `FieldGroup` 承载状态，分组外观用 `CellGroup` 自己拼—— `Form` 挂载时会调一次 setInitialValues / setCallbacks，一屏摆好几个
 *    `Form` 时后挂载的会盖掉先挂载的， initialValues 和 onFinish 就只剩最后一个生效了。
 * 3. **弹层类控件的显隐归页面**，值归表单：`show` 是页面的 state，整行的 `onPress` 负责打开， 值等 `onConfirm` 回传。
 */
const FormSolutionScreen = () => {
  const [form] = useForm<SolutionForm>();

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState('');
  const [industryShow, setIndustryShow] = useState(false);
  const [regionShow, setRegionShow] = useState(false);
  const [birthdayShow, setBirthdayShow] = useState(false);
  const [remindShow, setRemindShow] = useState(false);
  const [appointmentShow, setAppointmentShow] = useState(false);

  const emailRef = useRef<RefInstance<InputProps['ref']>>(null);
  const passwordRef = useRef<RefInstance<InputProps['ref']>>(null);
  const confirmRef = useRef<RefInstance<InputProps['ref']>>(null);

  // 服务端错误不进表单状态，只放在 ref 里给 validator 读：它不该触发渲染，也不该被 resetFields 之外的东西清掉
  const serverErrorsRef = useRef<Partial<Record<ServerErrorField, ServerError>>>({});

  const agreed = useWatch('agreed', { form });
  const needInvoice = useWatch('needInvoice', { form });

  const canSubmit = Boolean(agreed) && !isSubmitting;

  /** 服务端错误只在字段值没被改动时有效，用户一改就自动放行，不需要额外的清理时机 */
  function resolveServerError(field: ServerErrorField, value: string) {
    const hit = serverErrorsRef.current[field];

    return hit && hit.value === value ? hit.message : undefined;
  }

  async function handleFinish(values: SolutionForm) {
    setFormError('');
    setIsSubmitting(true);

    const errors = await submitProfile(values);

    setIsSubmitting(false);

    const errorFields = Object.keys(errors) as ServerErrorField[];

    if (errorFields.length > 0) {
      serverErrorsRef.current = errors;
      setFormError(`服务端打回了 ${errorFields.length} 个字段，已回填到对应输入框`);

      // 回填的动作就是让这些字段重跑一次校验：错误文案挂在字段自己的 validator 上，
      // 不需要一套「外部错误」的并行状态，也就不会出现改了值提示还挂着的情况
      form.validateFields(errorFields);
      return;
    }

    serverErrorsRef.current = {};
    setSubmitted(JSON.stringify(values, null, 2));
    showSuccessToast('提交成功');
  }

  function handleFinishFailed(errorInfo: ValidateErrorEntity<SolutionForm>) {
    setSubmitted('');
    setFormError(`还有 ${errorInfo.errorCount} 处没填对，第一个是「${errorInfo.firstErrorName}」`);
  }

  function handleValuesChange(changed: Partial<SolutionForm>) {
    // 确认密码依赖 password：改上面那格时，把下面已经填过的那格重新校验一遍，
    // 否则先填对再改上面，错误提示不会自己冒出来
    if (changed.password !== undefined && form.getFieldTouched('confirmPassword')) {
      form.validateField('confirmPassword');
    }
  }

  function handleReset() {
    serverErrorsRef.current = {};
    setFormError('');
    setSubmitted('');
    form.resetFields();
  }

  return (
    <View className="flex-1 bg-muted">
      <DemoHeader title="表单解决方案" />

      <KeyboardAwareScrollView
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        className="flex-1 bg-muted"
        contentContainerClassName="px-4 pb-safe-offset-8 pt-2"
      >
        <FieldGroup<SolutionForm>
          form={form}
          gap={4}
          initialValues={INITIAL_VALUES}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          onValuesChange={handleValuesChange}
        >
          <Section
            description="Input 守 value / onChange 约定，FormItem 不用额外配置。returnKeyType 配 ref 把几格串起来，回车依次跳到下一格。"
            title="文本输入"
          >
            <CellGroup>
              <FormItem<SolutionForm>
                required
                description="填 admin 再提交，看服务端错误怎么回填"
                label="昵称"
                name="nickname"
                rules={[
                  { message: '请输入昵称', required: true },
                  { maxLength: 12, message: '昵称最多 12 个字' },
                  { validator: (___rule, value) => resolveServerError('nickname', value) }
                ]}
              >
                <Input
                  clearable
                  returnKeyType="next"
                  variant="none"
                  placeholder="请输入昵称"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </FormItem>

              <FormItem<SolutionForm>
                required
                description="填 xxx@qq.com 再提交，同样会被服务端打回"
                label="邮箱"
                name="email"
                rules={[
                  { message: '请输入邮箱', required: true },
                  { message: '邮箱格式不正确', type: 'email' },
                  { validator: (___rule, value) => resolveServerError('email', value) }
                ]}
              >
                <Input
                  ref={emailRef}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  variant="none"
                  placeholder="name@example.com"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </FormItem>

              <FormItem<SolutionForm>
                required
                description="异步校验：validator 返回 Promise，debounceMs 决定停手多久才发请求。填 13800000000 会被判为已注册"
                label="手机号"
                name="phone"
                rules={[
                  { message: '请输入手机号', required: true },
                  { message: '手机号格式不正确', pattern: /^1\d{10}$/ },
                  {
                    debounceMs: 400,
                    validator: async (___rule, value) =>
                      (await checkPhoneRegistered(value)) ? '该手机号已注册' : undefined
                  }
                ]}
              >
                <Input
                  keyboardType="number-pad"
                  returnKeyType="next"
                  variant="none"
                  placeholder="请输入手机号"
                />
              </FormItem>

              <FormItem<SolutionForm>
                required
                label="登录密码"
                name="password"
                rules={[
                  { message: '请输入密码', required: true },
                  { message: '密码至少 8 位', minLength: 8 }
                ]}
              >
                <Input
                  ref={passwordRef}
                  returnKeyType="next"
                  type="password"
                  variant="none"
                  placeholder="至少 8 位"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                />
              </FormItem>

              <FormItem<SolutionForm>
                required
                description="联动校验：validator 的第三个参数是全部表单值，改上面那格会让这格重跑"
                label="确认密码"
                name="confirmPassword"
                rules={[
                  { message: '请再次输入密码', required: true },
                  {
                    validator: (___rule, value, values) =>
                      value === (values as SolutionForm).password ? undefined : '两次输入的密码不一致'
                  }
                ]}
              >
                <Input
                  ref={confirmRef}
                  returnKeyType="done"
                  type="password"
                  variant="none"
                  placeholder="请再次输入密码"
                />
              </FormItem>

              <FormItem<SolutionForm>
                description="长内容用 labelAlign=top，标签压在输入区上方"
                label="个人简介"
                labelAlign="top"
                name="bio"
              >
                <Input
                  multiline
                  variant="none"
                  classNames={{ control: 'h-20' }}
                  placeholder="介绍一下自己"
                />
              </FormItem>
            </CellGroup>
          </Section>

          <Section
            description="Switch 是 checked / onCheckedChange，要改两个属性名；RadioGroup / CheckboxGroup 守约，直接放进去即可。"
            title="开关、单选与多选"
          >
            <CellGroup>
              <FormItem<SolutionForm>
                classNames={{ control: 'items-end' }}
                description="valuePropName=checked、trigger=onCheckedChange"
                label="接收推送"
                name="notify"
                trigger="onCheckedChange"
                valuePropName="checked"
              >
                <Switch />
              </FormItem>

              <FormItem<SolutionForm>
                label="性别"
                name="gender"
              >
                <RadioGroup direction="horizontal">
                  <Radio name="male">男</Radio>
                  <Radio name="female">女</Radio>
                  <Radio name="other">其他</Radio>
                </RadioGroup>
              </FormItem>

              <FormItem<SolutionForm>
                required
                description="max=2，选满之后其余项点不动"
                label="通知渠道"
                labelAlign="top"
                name="channels"
                rules={[{ message: '至少留一个渠道', required: true }]}
              >
                <CheckboxGroup
                  direction="horizontal"
                  max={2}
                >
                  <Checkbox name="push">推送</Checkbox>
                  <Checkbox name="sms">短信</Checkbox>
                  <Checkbox name="email">邮件</Checkbox>
                </CheckboxGroup>
              </FormItem>

              <FormItem<SolutionForm>
                description="自己写的控件只要守 value / onChange 约定，接进来和内置组件没区别"
                label="兴趣标签"
                labelAlign="top"
                name="tags"
              >
                <TagSelect options={TAG_OPTIONS} />
              </FormItem>
            </CellGroup>
          </Section>

          <Section
            description="卡片式选择用 items 描述选项，值仍然是 value + onChange，接法与普通 Group 完全一致。"
            title="卡片式选择"
          >
            <CellGroup>
              <FormItem<SolutionForm>
                label="套餐"
                labelAlign="top"
                name="plan"
              >
                <RadioGroupCard items={PLAN_ITEMS} />
              </FormItem>

              <FormItem<SolutionForm>
                description="同样支持 max"
                label="增值服务"
                labelAlign="top"
                name="services"
              >
                <CheckboxGroupCard
                  items={SERVICE_ITEMS}
                  max={2}
                />
              </FormItem>
            </CellGroup>
          </Section>

          <Section
            description="Picker / DatePicker / TimePicker / PickerGroup 的值都由 onConfirm 回传（面板里滚动只改临时值），所以 trigger 改成 onConfirm；show 由页面持有，整行 onPress 负责打开。ActionSheet 走 onChange，show 自己托管。"
            title="弹层选择器"
          >
            <CellGroup>
              <FormItem<SolutionForm>
                showArrow
                description="单列"
                label="所属行业"
                name="industry"
                trigger="onConfirm"
                onPress={() => setIndustryShow(true)}
              >
                <Picker
                  columns={INDUSTRIES}
                  show={industryShow}
                  title="选择行业"
                  onUpdateShow={setIndustryShow}
                >
                  {args => <PickedText label={resolveOptionLabel(INDUSTRIES, args.value)} />}
                </Picker>
              </FormItem>

              <FormItem<SolutionForm>
                showArrow
                description="级联三列，选中值是一个数组"
                label="所在地区"
                name="region"
                trigger="onConfirm"
                onPress={() => setRegionShow(true)}
              >
                <Picker
                  columns={REGIONS}
                  show={regionShow}
                  title="选择地区"
                  onUpdateShow={setRegionShow}
                >
                  {args => <PickedText label={resolveCascadeLabels(REGIONS, args.value)} />}
                </Picker>
              </FormItem>

              <FormItem<SolutionForm>
                showArrow
                description="formatter 给数字列补中文单位，min / maxDate 限定范围"
                label="出生日期"
                name="birthday"
                trigger="onConfirm"
                onPress={() => setBirthdayShow(true)}
              >
                <DatePicker
                  formatter={DATE_FORMATTER}
                  show={birthdayShow}
                  title="选择生日"
                  maxDate={new Date()}
                  minDate={new Date(1950, 0, 1)}
                  onUpdateShow={setBirthdayShow}
                >
                  {args => <PickedText label={args.value.join('-')} />}
                </DatePicker>
              </FormItem>

              <FormItem<SolutionForm>
                showArrow
                label="每日提醒"
                name="remindAt"
                trigger="onConfirm"
                onPress={() => setRemindShow(true)}
              >
                <TimePicker
                  formatter={TIME_FORMATTER}
                  show={remindShow}
                  title="选择提醒时间"
                  onUpdateShow={setRemindShow}
                >
                  {args => <PickedText label={args.value.join(':')} />}
                </TimePicker>
              </FormItem>

              <FormItem<SolutionForm>
                showArrow
                description="PickerGroup 的值属性名是 values（复数），两个滚轮各占一个 tab"
                label="预约时段"
                name="appointment"
                trigger="onConfirm"
                valuePropName="values"
                onPress={() => setAppointmentShow(true)}
              >
                <PickerGroup
                  pickers={APPOINTMENT_PICKERS}
                  show={appointmentShow}
                  onUpdateShow={setAppointmentShow}
                >
                  {args => <PickedText label={resolveAppointmentLabel(args.values)} />}
                </PickerGroup>
              </FormItem>

              <FormItem<SolutionForm>
                showArrow
                description="ActionSheet 直接走 onChange，面板显隐它自己管，页面不用再持一份 state"
                label="了解渠道"
                name="source"
              >
                <ActionSheet
                  closeOnClickAction
                  actions={SOURCE_ACTIONS}
                  cancelText="取消"
                  title="从哪里了解到我们"
                >
                  {args => (
                    <Pressable onPress={args.toggle}>
                      <PickedText label={resolveActionLabel(args.value)} />
                    </Pressable>
                  )}
                </ActionSheet>
              </FormItem>
            </CellGroup>
          </Section>

          <Section
            description="FormComputedField 的结果是表单数据的一部分，会进 onFinish、也能被校验（纯展示的派生值不该用它，直接在渲染里算）。useWatch 只订阅值，用来控制字段显隐。"
            title="计算字段与条件字段"
          >
            <CellGroup>
              <FormItem<SolutionForm>
                label="单价"
                name="price"
              >
                <Input
                  keyboardType="decimal-pad"
                  variant="none"
                  placeholder="请输入单价"
                />
              </FormItem>

              <FormItem<SolutionForm>
                label="购买数量"
                name="quantity"
              >
                <Stepper
                  integer
                  max={99}
                  min={1}
                />
              </FormItem>

              <FormComputedField<SolutionForm>
                deps={['price', 'quantity']}
                description="随单价与数量自动重算；TextInput 只吃字符串，所以算完要 toFixed"
                label="合计"
                name="total"
                compute={get => (Number(get('price') || 0) * Number(get('quantity') || 0)).toFixed(2)}
              >
                <Input variant="none" />
              </FormComputedField>

              <FormItem<SolutionForm>
                classNames={{ control: 'items-end' }}
                label="需要发票"
                name="needInvoice"
                trigger="onCheckedChange"
                valuePropName="checked"
              >
                <Switch />
              </FormItem>

              {needInvoice ? (
                <FormItem<SolutionForm>
                  required
                  description="preserve=false：关掉开关，这个字段连同它的值一起从表单数据里消失"
                  label="发票抬头"
                  name="invoiceTitle"
                  preserve={false}
                  rules={[{ message: '请填写发票抬头', required: true }]}
                >
                  <Input
                    variant="none"
                    placeholder="公司全称"
                  />
                </FormItem>
              ) : null}
            </CellGroup>
          </Section>

          <Section
            description="FormList 管数组字段：field.key 是它维护的稳定标识（用下标当 key 会在删中间项时错位），子字段名在 field.name 后面接一段拼出来。"
            title="动态字段（FormList）"
          >
            <View className="gap-3">
              <FormList<SolutionForm> name="contacts">
                {(fields, ops) => (
                  <>
                    {fields.map((field, index) => {
                      // field.name 是 `contacts.0` 这样的路径字符串，收窄一次才能拼出合法的字段路径
                      const itemName = field.name as `contacts.${number}`;

                      return (
                        <CellGroup
                          key={field.key}
                          title={`联系人 ${index + 1}`}
                        >
                          <FormItem<SolutionForm>
                            required
                            label="姓名"
                            name={`${itemName}.name`}
                            rules={[{ message: '请填写姓名', required: true }]}
                          >
                            <Input
                              variant="none"
                              placeholder="请输入姓名"
                            />
                          </FormItem>

                          <FormItem<SolutionForm>
                            label="手机号"
                            name={`${itemName}.phone`}
                            rules={[{ message: '手机号格式不正确', pattern: /^1\d{10}$/ }]}
                          >
                            <Input
                              keyboardType="number-pad"
                              variant="none"
                              placeholder="请输入手机号"
                            />
                          </FormItem>

                          <Cell
                            classNames={{ title: 'text-destructive' }}
                            disabled={fields.length === 1}
                            title="移除这一位"
                            onPress={() => ops.remove(index)}
                          />
                        </CellGroup>
                      );
                    })}

                    <Button
                      variant="outline"
                      onPress={() => ops.insert(fields.length, { name: '', phone: '' })}
                    >
                      添加联系人
                    </Button>
                  </>
                )}
              </FormList>
            </View>
          </Section>

          <Section
            description="form.submit() 触发全量校验：过了走 onFinish，没过走 onFinishFailed。字段级错误由 FormItem 就地展示，表单级错误自己留一份状态汇总。"
            title="校验与提交"
          >
            <CellGroup>
              <FormItem<SolutionForm>
                classNames={{ control: 'items-end' }}
                description="布尔字段不能用 required：false 不算空值，得自己写 validator"
                label="同意用户协议"
                name="agreed"
                trigger="onCheckedChange"
                valuePropName="checked"
                rules={[{ validator: (___rule, value) => (value ? undefined : '请先同意用户协议') }]}
              >
                <Checkbox />
              </FormItem>
            </CellGroup>

            {formError ? (
              <View className="rounded-xl bg-destructive/10 p-3">
                <Text className="text-sm text-destructive">{formError}</Text>
              </View>
            ) : null}

            <View className="flex-row gap-3">
              <Button
                className="flex-1"
                disabled={!canSubmit}
                loading={isSubmitting}
                shape="pill"
                size="lg"
                onPress={() => form.submit()}
              >
                提交
              </Button>

              <Button
                className="flex-1"
                disabled={isSubmitting}
                shape="pill"
                size="lg"
                variant="outline"
                onPress={handleReset}
              >
                重置
              </Button>
            </View>

            {submitted ? (
              <View className="gap-2 rounded-xl bg-background p-4">
                <Text
                  size="sm"
                  weight="medium"
                >
                  提交成功，onFinish 收到的表单数据
                </Text>

                <Text
                  color="muted"
                  size="xs"
                >
                  {submitted}
                </Text>
              </View>
            ) : null}
          </Section>
        </FieldGroup>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default FormSolutionScreen;
