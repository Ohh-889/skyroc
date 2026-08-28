import {
  ArrowClockwise,
  CheckCircle,
  ClockCounterClockwise,
  Eye,
  EyeSlash,
  Info,
  Lock,
  Moon,
  PaperPlaneTilt,
  ShieldCheck,
  Sun,
  Translate,
  User,
  WechatLogo
} from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

const copy = {
  zh: {
    account: '账号',
    accountError: '请输入账号',
    accountPlaceholder: '请输入用户名、手机号或邮箱',
    adminHint: '账号由管理员创建，如需帮助请联系管理员',
    captcha: '图形验证码',
    captchaError: '请输入图形验证码',
    captchaPlaceholder: '请输入图形字符',
    codeLogin: '使用验证码登录',
    copyright: '© 2026 Skyroc',
    featureAudit: '关键操作可追溯',
    featurePermission: '统一组织与权限',
    featureSecure: '安全可靠的管理入口',
    feishu: '飞书登录',
    forgot: '忘记密码？',
    language: '中',
    login: '登录',
    loggingIn: '正在登录…',
    otherLogin: '其他方式登录',
    password: '密码',
    passwordError: '请输入密码',
    passwordPlaceholder: '请输入密码',
    privacy: '隐私政策',
    refresh: '换一张',
    remember: '保持登录',
    subtitle: '使用企业账号继续',
    success: '原型演示：登录信息已提交',
    systemName: 'Skyroc 管理系统',
    terms: '服务条款',
    theme: '浅色',
    title: '欢迎登录 Skyroc',
    value: '让企业管理更清晰、\n更安全',
    wechat: '微信登录'
  },
  en: {
    account: 'Account',
    accountError: 'Enter your account',
    accountPlaceholder: 'Username, mobile number, or email',
    adminHint: 'Accounts are created by administrators. Contact your administrator for help.',
    captcha: 'Verification code',
    captchaError: 'Enter the verification code',
    captchaPlaceholder: 'Enter the characters',
    codeLogin: 'Sign in with a verification code',
    copyright: '© 2026 Skyroc',
    featureAudit: 'Traceable key operations',
    featurePermission: 'Unified teams and permissions',
    featureSecure: 'A secure management entrance',
    feishu: 'Lark',
    forgot: 'Forgot password?',
    language: 'EN',
    login: 'Sign in',
    loggingIn: 'Signing in…',
    otherLogin: 'Other sign-in methods',
    password: 'Password',
    passwordError: 'Enter your password',
    passwordPlaceholder: 'Enter your password',
    privacy: 'Privacy',
    refresh: 'Refresh',
    remember: 'Keep me signed in',
    subtitle: 'Continue with your enterprise account',
    success: 'Prototype: sign-in information submitted',
    systemName: 'Skyroc Admin',
    terms: 'Terms',
    theme: 'Light',
    title: 'Welcome to Skyroc',
    value: 'Clearer, safer enterprise management',
    wechat: 'WeChat'
  }
};

export const App = () => {
  const [language, setLanguage] = useState('zh');
  const [theme, setTheme] = useState('light');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);
  const [values, setValues] = useState({ account: '', captcha: '', password: '' });
  const [errors, setErrors] = useState({});
  const captchaRef = useRef(null);
  const t = copy[language];
  const themeLabel = theme === 'light' ? t.theme : language === 'zh' ? '深色' : 'Dark';
  const themeAria =
    theme === 'light'
      ? language === 'zh'
        ? '切换深色模式'
        : 'Switch to dark mode'
      : language === 'zh'
        ? '切换浅色模式'
        : 'Switch to light mode';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = captchaRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const captchaValue = ['J0A9', '7K2Q', 'M5RX', '8PD3'][captchaKey % 4];
    const dark = theme === 'dark';

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = dark ? '#192237' : '#f3faee';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = dark ? '#51637e' : '#b9d7a9';
    context.lineWidth = 1;

    for (let index = 0; index < 6; index += 1) {
      context.beginPath();
      context.moveTo(index * 25, (index * 17) % 48);
      context.lineTo(128 - index * 9, (index * 29) % 52);
      context.stroke();
    }

    context.fillStyle = dark ? '#8ccd73' : '#59a83f';
    context.font = '700 28px "Segoe UI", sans-serif';
    context.setTransform(1, -0.05, 0.04, 1, 0, 2);
    context.fillText(captchaValue, 23, 35);
    context.setTransform(1, 0, 0, 1, 0, 0);
  }, [captchaKey, theme]);

  function updateField(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    if (errors[name]) setErrors(current => ({ ...current, [name]: '' }));
  }

  function validateField(name) {
    if (!values[name].trim()) {
      setErrors(current => ({ ...current, [name]: t[`${name}Error`] }));
      return false;
    }

    setErrors(current => ({ ...current, [name]: '' }));
    return true;
  }

  function refreshCaptcha() {
    setCaptchaKey(current => current + 1);
    setValues(current => ({ ...current, captcha: '' }));
    setErrors(current => ({ ...current, captcha: '' }));
  }

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    ['account', 'password', 'captcha'].forEach(name => {
      if (!values[name].trim()) nextErrors[name] = t[`${name}Error`];
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      showToast(t.success);
    }, 900);
  }

  function handleSecondaryAction(label) {
    showToast(`${label} · Prototype`);
  }

  return (
    <main className="login-page">
      <img
        className="security-art"
        src="/assets/security-illustration.png"
        alt=""
        aria-hidden="true"
      />

      <header className="brand-header">
        <img
          className="brand-logo"
          src="/assets/skyroc-logo.svg"
          alt=""
        />
        <span>{t.systemName}</span>
      </header>

      <div className="utility-actions">
        <button
          className="utility-button"
          type="button"
          aria-label={themeAria}
          onClick={() => setTheme(current => (current === 'light' ? 'dark' : 'light'))}
        >
          {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
          <span>{themeLabel}</span>
        </button>
        <button
          className="utility-button"
          type="button"
          aria-label={language === 'zh' ? '切换英文' : 'Switch to Chinese'}
          onClick={() => setLanguage(current => (current === 'zh' ? 'en' : 'zh'))}
        >
          <Translate size={20} />
          <span>{t.language}</span>
        </button>
      </div>

      <section
        className="brand-story"
        aria-labelledby="brand-value"
      >
        <h1 id="brand-value">{t.value}</h1>
        <ul>
          <li>
            <span className="feature-icon">
              <ShieldCheck
                size={23}
                weight="fill"
              />
            </span>
            {t.featurePermission}
          </li>
          <li>
            <span className="feature-icon">
              <ClockCounterClockwise size={23} />
            </span>
            {t.featureAudit}
          </li>
          <li>
            <span className="feature-icon">
              <CheckCircle
                size={23}
                weight="fill"
              />
            </span>
            {t.featureSecure}
          </li>
        </ul>
      </section>

      <section
        className="auth-panel"
        aria-labelledby="login-heading"
      >
        <header className="auth-heading">
          <h2 id="login-heading">{t.title}</h2>
          <p>{t.subtitle}</p>
        </header>

        <form
          noValidate
          onSubmit={handleSubmit}
        >
          <div className={`field-group ${errors.account ? 'has-error' : ''}`}>
            <label htmlFor="account">{t.account}</label>
            <div className="input-shell">
              <User
                size={21}
                aria-hidden="true"
              />
              <input
                id="account"
                name="account"
                type="text"
                autoComplete="username"
                placeholder={t.accountPlaceholder}
                value={values.account}
                aria-describedby="account-error"
                aria-invalid={Boolean(errors.account)}
                onBlur={() => validateField('account')}
                onChange={updateField}
              />
            </div>
            <span
              className="field-error"
              id="account-error"
            >
              {errors.account || '\u00a0'}
            </span>
          </div>

          <div className={`field-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">{t.password}</label>
            <div className="input-shell">
              <Lock
                size={21}
                aria-hidden="true"
              />
              <input
                id="password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder={t.passwordPlaceholder}
                value={values.password}
                aria-describedby="password-error"
                aria-invalid={Boolean(errors.password)}
                onBlur={() => validateField('password')}
                onChange={updateField}
              />
              <button
                className="input-action"
                type="button"
                aria-label={passwordVisible ? '隐藏密码' : '显示密码'}
                onClick={() => setPasswordVisible(current => !current)}
              >
                {passwordVisible ? <EyeSlash size={21} /> : <Eye size={21} />}
              </button>
            </div>
            <span
              className="field-error"
              id="password-error"
            >
              {errors.password || '\u00a0'}
            </span>
          </div>

          <div className={`field-group ${errors.captcha ? 'has-error' : ''}`}>
            <label htmlFor="captcha">{t.captcha}</label>
            <div className="captcha-row">
              <div className="input-shell">
                <input
                  id="captcha"
                  name="captcha"
                  type="text"
                  autoComplete="off"
                  maxLength={6}
                  placeholder={t.captchaPlaceholder}
                  value={values.captcha}
                  aria-describedby="captcha-error"
                  aria-invalid={Boolean(errors.captcha)}
                  onBlur={() => validateField('captcha')}
                  onChange={updateField}
                />
              </div>
              <canvas
                ref={captchaRef}
                className="captcha-image"
                width="128"
                height="52"
                aria-label="图形验证码"
              />
              <button
                className="refresh-button"
                type="button"
                onClick={refreshCaptcha}
              >
                <ArrowClockwise size={19} />
                <span>{t.refresh}</span>
              </button>
            </div>
            <span
              className="field-error"
              id="captcha-error"
            >
              {errors.captcha || '\u00a0'}
            </span>
          </div>

          <div className="form-options">
            <label className="remember-option">
              <input
                type="checkbox"
                checked={remember}
                onChange={event => setRemember(event.target.checked)}
              />
              <span>{t.remember}</span>
            </label>
            <button
              type="button"
              className="link-button"
              onClick={() => handleSecondaryAction(t.forgot)}
            >
              {t.forgot}
            </button>
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? t.loggingIn : t.login}
          </button>

          <button
            type="button"
            className="mode-switch"
            onClick={() => handleSecondaryAction(t.codeLogin)}
          >
            {t.codeLogin}
          </button>

          <div className="divider">
            <span>{t.otherLogin}</span>
          </div>

          <div className="social-actions">
            <button
              type="button"
              onClick={() => handleSecondaryAction(t.wechat)}
            >
              <WechatLogo
                size={22}
                weight="fill"
              />
              {t.wechat}
            </button>
            <button
              type="button"
              onClick={() => handleSecondaryAction(t.feishu)}
            >
              <PaperPlaneTilt
                size={22}
                weight="fill"
              />
              {t.feishu}
            </button>
          </div>

          <p className="admin-hint">
            <Info size={16} />
            <span>{t.adminHint}</span>
          </p>
        </form>

        <footer className="auth-footer">
          <button
            type="button"
            onClick={() => handleSecondaryAction(t.privacy)}
          >
            {t.privacy}
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => handleSecondaryAction(t.terms)}
          >
            {t.terms}
          </button>
          <span>·</span>
          <span>{t.copyright}</span>
        </footer>
      </section>

      {toast ? (
        <div
          className="toast"
          role="status"
        >
          <CheckCircle
            size={20}
            weight="fill"
          />
          {toast}
        </div>
      ) : null}
    </main>
  );
};
