import { Button, Checkbox, Input, Label, Password } from '@skyroc/web-ui';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import type { FormEvent } from 'react';

const RECENT_WORKSPACES = [
  { name: 'Desktop Kit', detail: '本地工作区 · 2 分钟前', accent: '#d7ff64' },
  { name: 'Release Notes', detail: '云端同步 · 昨天', accent: '#ffbd6a' }
] as const;

const LoginPage = () => {
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
      setFormError('请输入账号和密码');
      return;
    }

    setFormError('');
    enterWorkspace();
  }

  function handleLocalMode() {
    setFormError('');
    enterWorkspace();
  }

  return (
    <main className="min-h-screen bg-[#10130f]  text-[#eef1e5]">
      <div className="auth-grid relative mx-auto grid overflow-hidden   bg-[#151913] shadow-[0_35px_100px_rgba(0,0,0,0.42)] sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="pointer-events-none absolute -left-32 bottom-0 size-[420px] rounded-full border border-[#d7ff64]/20" />
        <div className="auth-orbit pointer-events-none absolute -left-16 bottom-16 size-[290px] rounded-full border border-dashed border-white/10" />

        <section className="relative hidden min-h-[720px] flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14">
          <header className="auth-enter flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-[14px] bg-[#d7ff64] text-sm font-black text-[#10130f] shadow-[0_0_0_6px_rgba(215,255,100,0.08)]">
                S
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.22em]">SKYROC</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[0.28em] text-[#a7ae9d]">Desktop workspace</div>
              </div>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-[#a7ae9d]">
              v2.3.0
            </span>
          </header>

          <div className="auth-enter-delay relative z-10 max-w-[620px] pb-4">
            <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#d7ff64]">
              <span className="h-px w-10 bg-[#d7ff64]" />
              Work locally, sync when ready
            </div>
            <div className="max-w-[580px] font-['Iowan_Old_Style','Palatino_Linotype',Georgia,serif] text-[clamp(3.6rem,6vw,6.6rem)] leading-[0.88] font-normal tracking-[-0.055em] text-[#f3f0e7]">
              桌面，是工作的起点。
            </div>
            <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#aeb5a5]">
              打开最近工作区、继续后台任务，并在需要时把偏好与进度安全同步到云端。
            </p>
          </div>

          <div className="auth-enter-delay relative z-10 grid max-w-[650px] gap-3 xl:grid-cols-2">
            {RECENT_WORKSPACES.map(workspace => (
              <button
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.075]"
                key={workspace.name}
                onClick={handleLocalMode}
                type="button"
              >
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-[#11140f]"
                  style={{ backgroundColor: workspace.accent }}
                >
                  {workspace.name.slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#eef1e5]">{workspace.name}</span>
                  <span className="mt-1 block truncate text-xs text-[#8e9686]">{workspace.detail}</span>
                </span>
                <span className="ml-auto text-lg text-[#697061] transition group-hover:translate-x-1 group-hover:text-[#d7ff64]">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="relative flex min-h-[calc(100vh-1.5rem)] items-center justify-center bg-[#f0ede4] px-6 py-10 text-[#171a16] sm:min-h-[calc(100vh-2rem)] sm:px-10 lg:min-h-full lg:rounded-l-[36px] lg:px-14 xl:px-20">
          <div className="auth-enter w-full max-w-[430px]">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-[#171a16] text-xs font-black text-[#d7ff64]">
                  S
                </div>
                <span className="text-sm font-semibold tracking-[0.2em]">SKYROC</span>
              </div>
              <span className="text-xs text-[#777b71]">v2.3.0</span>
            </div>

            <div className="mb-9">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6d2c7] bg-white/60 px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#5f645a]">
                <span className="size-1.5 rounded-full bg-[#76a900] shadow-[0_0_0_4px_rgba(118,169,0,0.12)]" />
                安全连接已就绪
              </div>
              <h1 className="font-['Iowan_Old_Style','Palatino_Linotype',Georgia,serif] text-5xl font-normal tracking-[-0.045em] text-[#171a16]">
                欢迎回来
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#71756c]">登录后同步工作区、偏好设置和后台任务记录。</p>
            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <Label
                  className="text-xs font-semibold text-[#454940]"
                  htmlFor="account"
                >
                  账号
                </Label>
                <Input
                  autoComplete="username"
                  classNames={{
                    control: 'h-full text-sm text-[#252820] placeholder:text-[#969a90]',
                    root: 'h-12 rounded-xl border-[#d5d0c4] bg-white/75 px-3.5 shadow-sm focus-within:ring-[#7ca800]'
                  }}
                  id="account"
                  name="account"
                  placeholder="邮箱或用户名"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-xs font-semibold text-[#454940]"
                    htmlFor="password"
                  >
                    密码
                  </Label>
                  <button
                    className="text-xs font-medium text-[#68704f] transition hover:text-[#303523]"
                    onClick={() => setFormError('密码找回需要接入实际认证服务')}
                    type="button"
                  >
                    忘记密码？
                  </button>
                </div>
                <Password
                  autoComplete="current-password"
                  classNames={{
                    control: 'h-full text-sm text-[#252820] placeholder:text-[#969a90]',
                    root: 'h-12 rounded-xl border-[#d5d0c4] bg-white/75 px-3.5 shadow-sm focus-within:ring-[#7ca800]'
                  }}
                  id="password"
                  name="password"
                  placeholder="输入登录密码"
                />
              </div>

              <div className="flex min-h-6 items-center justify-between gap-4">
                <Checkbox
                  classNames={{
                    control:
                      'border-[#bbb7ac] data-[state=checked]:border-[#7ca800] data-[state=checked]:bg-[#7ca800] data-[state=checked]:text-white',
                    label: 'text-xs text-[#686d63]'
                  }}
                  defaultChecked
                  id="remember-account"
                >
                  记住账号
                </Checkbox>
                {formError ? <span className="text-right text-xs text-[#a24032]">{formError}</span> : null}
              </div>

              <Button
                className="h-12 w-full rounded-xl !bg-[#171a16] text-sm font-semibold !text-[#f4f5ef] shadow-[0_12px_28px_rgba(23,26,22,0.18)] hover:!-translate-y-0.5 hover:!bg-[#252a23]"
                type="submit"
              >
                登录并进入工作台
                <span className="ml-2 text-[#d7ff64]">→</span>
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-[#999b94]">
              <span className="h-px flex-1 bg-[#d8d4ca]" />
              Or continue offline
              <span className="h-px flex-1 bg-[#d8d4ca]" />
            </div>

            <Button
              className="h-12 w-full rounded-xl border-[#cfcabf] bg-transparent text-sm font-semibold text-[#343830] hover:bg-white/60"
              data-testid="local-mode"
              onClick={handleLocalMode}
              type="button"
              variant="outline"
            >
              无需登录，使用本地模式
            </Button>

            <p className="mt-6 text-center text-[11px] leading-5 text-[#92958d]">
              模板演示阶段不会提交真实凭证。继续即表示你同意本地数据仅存储在当前设备。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
