import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@skyroc/utils';
import type { FormInstance, FormRule } from 'antd';

function createRequiredRule(message: string): FormRule {
  return {
    message,
    required: true
  };
}

export function useAuthFormRules() {
  const { t } = useTranslation();

  const patternRules = {
    code: {
      message: t('form.code.invalid'),
      pattern: REG_CODE_SIX,
      validateTrigger: 'onChange'
    },
    email: {
      message: t('form.email.invalid'),
      pattern: REG_EMAIL,
      validateTrigger: 'onChange'
    },
    phone: {
      message: t('form.phone.invalid'),
      pattern: REG_PHONE,
      validateTrigger: 'onChange'
    },
    pwd: {
      message: t('form.pwd.invalid'),
      pattern: REG_PWD,
      validateTrigger: 'onChange'
    },
    userName: {
      message: t('form.userName.invalid'),
      pattern: REG_USER_NAME,
      validateTrigger: 'onChange'
    }
  } satisfies Record<string, FormRule>;

  const formRules = {
    code: [createRequiredRule(t('form.code.required')), patternRules.code],
    email: [createRequiredRule(t('form.email.required')), patternRules.email],
    phone: [createRequiredRule(t('form.phone.required')), patternRules.phone],
    pwd: [createRequiredRule(t('form.pwd.required')), patternRules.pwd],
    userName: [createRequiredRule(t('form.userName.required')), patternRules.userName]
  } satisfies Record<string, FormRule[]>;

  /** The default required rule */
  const defaultRequiredRule = createRequiredRule(t('form.required'));

  /** Create a rule for confirming the password */
  function createConfirmPwdRule(form: FormInstance) {
    const confirmPwdRule: FormRule[] = [
      { message: t('form.confirmPwd.required'), required: true },
      {
        message: t('form.confirmPwd.invalid'),
        validateTrigger: 'onChange',
        validator: (rule, value) => {
          const pwd = form.getFieldValue('password');
          const confirmPwd = typeof value === 'string' ? value : '';

          if (confirmPwd.trim() !== '' && confirmPwd !== pwd) {
            return Promise.reject(rule.message);
          }

          return Promise.resolve();
        }
      }
    ];

    return confirmPwdRule;
  }

  return {
    createConfirmPwdRule,
    createRequiredRule,
    defaultRequiredRule,
    formRules,
    patternRules
  };
}
