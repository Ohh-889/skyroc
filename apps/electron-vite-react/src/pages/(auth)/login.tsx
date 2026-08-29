import { Button, Checkbox, Icon, Input, Label, Password } from '@skyroc/web-ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface LoginPageProps {}

const PRODUCT_POINTS = [
  { description: '文件与偏好默认留在当前设备', icon: 'lucide:hard-drive', title: '本地优先' },
  { description: '需要时再登录并开启云端同步', icon: 'lucide:cloud', title: '按需同步' },
  { description: '离线也能继续进入工作空间', icon: 'lucide:wifi-off', title: '随时可用' }
] as const;

const LoginPage = (_props: LoginPageProps) => {
  const navigate = useNavigate();

  const [formError, setFormError] = useState('');

  function enterWorkspace() {
    navigate({ to: '/workspace' });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const account = String(formData.get('account') || '').trim();
    const password = String(formData.get('password') || '');

    if (!account || !password) {
      setFormError('请输入账号和密码后再登录');
      return;
    }

    setFormError('');
    enterWorkspace();
  }

  function handleLocalMode() {
    setFormError('');
    enterWorkspace();
  }

  function handleForgotPassword() {
    setFormError('密码找回将在认证服务接入后开放');
  }

  return (
    <main className="auth-page h-screen min-h-[560px] overflow-hidden bg-foreground text-background">
      <div className="auth-grid grid h-full lg:grid-cols-[minmax(0,1.08fr)_minmax(500px,0.92fr)]">
        <section className="relative hidden min-h-0 flex-col justify-between overflow-hidden px-12 py-10 lg:flex xl:px-16 xl:py-12">
          <div className="auth-glow pointer-events-none absolute inset-0" />

          <header className="auth-enter relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-primary-200 text-sm font-black text-primary-950 shadow-[0_10px_28px_rgba(15,20,12,0.2)]">
                S
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.22em]">SKYROC</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[0.24em] text-background/55">
                  Desktop workspace
                </div>
              </div>
            </div>
            <span className="rounded-full border border-background/10 bg-background/[0.04] px-3 py-1.5 text-[11px] text-background/55">
              v2.3.0
            </span>
          </header>

          <div className="auth-enter-delay relative z-10 max-w-[640px]">
            <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-200">
              <span className="h-px w-9 bg-primary-200/70" />
              Local first, sync when ready
            </div>
            <h1 className="max-w-[620px] font-['Iowan_Old_Style','Palatino_Linotype',Georgia,serif] text-[clamp(3.8rem,5.5vw,6.3rem)] leading-[0.9] font-normal tracking-[-0.055em] text-background">
              回到桌面，
              <br />
              接着做下去。
            </h1>
            <p className="mt-7 max-w-lg text-[15px] leading-7 text-background/62">
              工作区保持在本地，状态安静地延续。只有当你需要跨设备协作时，再开启同步。
            </p>
          </div>

          <div className="auth-enter-delay relative z-10 grid grid-cols-3 divide-x divide-background/10 rounded-2xl border border-background/10 bg-background/[0.035] p-1 shadow-[0_24px_70px_rgba(8,12,7,0.18)] backdrop-blur-sm">
            {PRODUCT_POINTS.map(point => (
              <div
                className="min-w-0 px-4 py-3.5"
                key={point.title}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-background/90">
                  <Icon
                    className="text-primary-200"
                    height="15"
                    icon={point.icon}
                    width="15"
                  />
                  {point.title}
                </div>
                <p className="mt-1.5 text-[11px] leading-4 text-background/48">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative min-h-0 overflow-y-auto bg-background text-foreground lg:rounded-l-[32px]">
          <div className="mx-auto flex min-h-full w-full max-w-[520px] flex-col justify-center px-10 py-4 sm:px-12 lg:max-w-[500px] lg:px-10 xl:px-14">
            <div className="auth-enter mb-4 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-primary text-xs font-black text-primary-foreground">
                  S
                </div>
                <span className="text-sm font-semibold tracking-[0.2em]">SKYROC</span>
              </div>
              <span className="text-xs text-muted-foreground">v2.3.0</span>
            </div>

            <div className="auth-enter">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                桌面工作空间
              </div>
              <h2 className="font-['Iowan_Old_Style','Palatino_Linotype',Georgia,serif] text-[40px] leading-tight font-normal tracking-[-0.04em] text-foreground">
                继续你的工作
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">先从当前设备开始，登录只是同步功能的入口。</p>
            </div>

            <div className="auth-enter-delay mt-4">
              <button
                className="group flex min-h-14 w-full items-center gap-3 rounded-xl bg-primary px-4 text-left text-primary-foreground shadow-[0_12px_30px_rgba(55,72,40,0.2)] transition duration-200 hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px"
                data-testid="local-mode"
                onClick={handleLocalMode}
                type="button"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-primary-foreground/12">
                  <Icon
                    height="18"
                    icon="lucide:monitor-up"
                    width="18"
                  />
                </span>
                <span>
                  <span className="block text-sm font-semibold">在此设备继续</span>
                  <span className="mt-0.5 block text-[11px] text-primary-foreground/68">无需账号，数据保存在本地</span>
                </span>
                <Icon
                  className="ml-auto transition-transform duration-200 group-hover:translate-x-0.5"
                  height="17"
                  icon="lucide:arrow-right"
                  width="17"
                />
              </button>
            </div>

            <div className="my-4 flex items-center gap-3 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              登录并开启同步
              <span className="h-px flex-1 bg-border" />
            </div>

            <form
              className="space-y-3"
              onSubmit={handleSubmit}
            >
              <div className="space-y-1.5">
                <Label
                  className="text-xs font-semibold text-foreground"
                  htmlFor="account"
                >
                  账号
                </Label>
                <Input
                  aria-describedby={formError ? 'login-error' : undefined}
                  autoComplete="username"
                  classNames={{
                    control: 'h-full text-sm text-foreground placeholder:text-muted-foreground/75',
                    root: 'h-11 rounded-xl border-input bg-card px-3.5 shadow-[0_2px_8px_rgba(37,42,34,0.035)] focus-within:ring-primary'
                  }}
                  id="account"
                  name="account"
                  placeholder="邮箱或用户名"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-xs font-semibold text-foreground"
                    htmlFor="password"
                  >
                    密码
                  </Label>
                  <button
                    className="text-xs font-medium text-muted-foreground transition hover:text-primary focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={handleForgotPassword}
                    type="button"
                  >
                    忘记密码？
                  </button>
                </div>
                <Password
                  aria-describedby={formError ? 'login-error' : undefined}
                  autoComplete="current-password"
                  classNames={{
                    control: 'h-full text-sm text-foreground placeholder:text-muted-foreground/75',
                    root: 'h-11 rounded-xl border-input bg-card px-3.5 shadow-[0_2px_8px_rgba(37,42,34,0.035)] focus-within:ring-primary'
                  }}
                  id="password"
                  name="password"
                  placeholder="输入登录密码"
                />
              </div>

              <div className="flex min-h-5 items-center justify-between gap-4">
                <Checkbox
                  classNames={{
                    control:
                      'border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                    label: 'text-xs text-muted-foreground'
                  }}
                  defaultChecked
                  id="remember-account"
                >
                  记住账号
                </Checkbox>
                {formError ? (
                  <span
                    className="text-right text-xs text-destructive"
                    id="login-error"
                    role="alert"
                  >
                    {formError}
                  </span>
                ) : null}
              </div>

              <Button
                className="h-11 w-full rounded-xl border-border bg-card text-sm font-semibold text-foreground shadow-sm hover:border-primary/35 hover:bg-accent hover:text-accent-foreground"
                type="submit"
                variant="outline"
              >
                登录并同步
                <Icon
                  className="ml-2"
                  height="16"
                  icon="lucide:cloud-upload"
                  width="16"
                />
              </Button>
            </form>

            <p className="auth-disclaimer mt-5 text-center text-[11px] leading-5 text-muted-foreground">
              当前为界面演示，不会提交真实凭证。你可以直接使用本地模式体验应用。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage
});
