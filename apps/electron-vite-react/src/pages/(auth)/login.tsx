import { Button, ButtonIcon, Form, FormField, Input, Password, message } from '@skyroc/web-ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

interface LoginFormValues {
  /** 用于登录与同步的邮箱。 */
  email: string;
  /** 当前账号的登录密码。 */
  password: string;
}

interface LoginPageProps {}

function handleMinimize() {
  window.desktopWindow?.minimize();
}

function handleClose() {
  window.desktopWindow?.close();
}

const LoginPage = (_props: LoginPageProps) => {
  const navigate = useNavigate();

  const platform = window.desktopWindow?.platform;
  const isMac = platform === 'darwin';

  function enterWorkspace() {
    navigate({ to: '/workspace' });
  }

  function handleSubmit(_values: LoginFormValues) {
    enterWorkspace();
  }

  function handleLocalMode() {
    enterWorkspace();
  }

  function handleForgotPassword() {
    message.info('密码找回功能暂未开放');
  }

  function handleMoreOptions() {
    message.info('更多选项将在设置中心提供');
  }

  useEffect(() => {
    window.desktopWindow?.setMode('auth');
  }, []);

  return (
    <main className="auth-page flex h-screen  flex-col bg-background overflow-hidden">
      <header className={`app-drag flex h-13 shrink-0 items-center px-3 ${isMac ? 'justify-end' : 'justify-between'}`}>
        {!isMac ? (
          <div className="app-no-drag flex items-center gap-1">
            <ButtonIcon
              aria-label="最小化窗口"
              className="text-muted-foreground shadow-none hover:text-foreground"
              icon="lucide:minus"
              onClick={handleMinimize}
              size="lg"
            />
            <ButtonIcon
              aria-label="关闭窗口"
              className="text-muted-foreground shadow-none hover:bg-destructive/10 hover:text-destructive"
              icon="lucide:x"
              onClick={handleClose}
              size="lg"
            />
          </div>
        ) : null}

        <ButtonIcon
          aria-label="更多选项"
          className="app-no-drag"
          icon="lucide:ellipsis-vertical"
          onClick={handleMoreOptions}
          size="lg"
        />
      </header>

      <section className="mx-auto flex w-full px-12 flex-1 flex-col pb-6 pt-9">
        <div className="auth-enter">
          <div className="text-[17px] font-semibold tracking-[0.3em] text-foreground">SKYROC</div>
          <h1 className="mt-7 text-[38px] leading-none font-semibold tracking-[-0.045em] text-foreground">欢迎回来</h1>
        </div>

        <Form<LoginFormValues>
          className="auth-enter-delay mt-9 space-y-4"
          initialValues={{ email: '', password: '' }}
          onFinish={handleSubmit}
          validateTrigger="onBlur"
        >
          <FormField<LoginFormValues>
            classNames={{
              label: 'text-[13px] font-medium text-foreground',
              message: 'text-xs font-normal'
            }}
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
            size="sm"
          >
            <Input
              autoComplete="email"
              classNames={{
                control: 'text-sm placeholder:text-muted-foreground/75',
                root: 'rounded-lg shadow-none'
              }}
              inputMode="email"
              placeholder="name@example.com"
              size="2xl"
            />
          </FormField>

          <FormField<LoginFormValues>
            classNames={{
              label: 'text-[13px] font-medium text-foreground',
              message: 'text-xs font-normal'
            }}
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
            size="sm"
          >
            <Password
              autoComplete="current-password"
              classNames={{
                root: 'rounded-lg shadow-none [&_[data-slot=password-visible]]:text-muted-foreground text-sm'
              }}
              placeholder="输入密码"
              size="2xl"
            />
          </FormField>

          <Button
            className="h-auto px-0 py-0 text-xs text-muted-foreground shadow-none hover:text-foreground"
            color="carbon"
            onClick={handleForgotPassword}
            size="sm"
            type="button"
            variant="link"
          >
            找回密码
          </Button>

          <Button
            className="w-full mt-3 text-sm"
            color="primary"
            shadow="none"
            size="2xl"
            type="submit"
          >
            登录
          </Button>

          <Button
            className="mx-auto flex h-auto px-0 py-0 text-xs text-muted-foreground shadow-none hover:text-foreground"
            color="carbon"
            data-testid="local-mode"
            onClick={handleLocalMode}
            size="sm"
            type="button"
            variant="link"
          >
            在此设备继续
          </Button>
        </Form>

        <p className="auth-enter-delay mt-auto text-center text-[11px] leading-5 text-muted-foreground">
          当前为界面演示，不会提交真实凭证。
        </p>
      </section>
    </main>
  );
};

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage
});
