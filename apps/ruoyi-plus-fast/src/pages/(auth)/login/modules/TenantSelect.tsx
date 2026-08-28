import { SvgIcon } from '@shell/ui/compose';
import { Select } from 'antd';

interface TenantSelectProps {
  /** 租户列表是否在请求中 */
  loading?: boolean;
  /** 选中另一个租户 */
  onChange: (tenantId: string) => void;
  /** 可选的租户，label 是企业名称 */
  options: { label: string; value: string }[];
  /** 当前选中的租户编号 */
  value: string;
}

/**
 * 登录页的租户下拉框
 *
 * 不是 AForm.Item：租户在两个登录页之间共享、由 useLoginTenant 持有，塞进表单就要在接口回 来之后再 setFieldValue 回填一次。这里只把它排版成和表单项一样。
 */
const TenantSelect = (props: TenantSelectProps) => {
  const { loading = false, onChange, options, value } = props;

  const { t } = useTranslation();

  return (
    <div className="mb-15px lt-md:mb-18px">
      <label
        className="block pb-6px text-13px text-base font-500 leading-18px"
        htmlFor="login-tenant"
      >
        {t('page.login.enterprise.tenantLabel')}
      </label>

      <Select
        // size="large" 就是 40px，和旁边几个 h-40px 的输入框对齐；剩下的是把边框、圆角、
        // 背景调成和它们同一套
        className="w-full text-13px [&_.ant-select-selector]:border-border [&_.ant-select-selector]:rounded-6px [&_.ant-select-selector]:bg-container [&_.ant-select-selector]:shadow-none [&_.ant-select-selector]:hover:border-primary"
        id="login-tenant"
        loading={loading}
        options={options}
        // 租户多起来之后翻列表找公司名很慢，按名字搜
        optionFilterProp="label"
        placeholder={t('page.login.enterprise.tenantPlaceholder')}
        prefix={<SvgIcon icon="ph:buildings" />}
        showSearch
        size="large"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TenantSelect;
