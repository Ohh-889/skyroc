import type { ErrorComponentProps } from '@tanstack/react-router';

interface ErrorPageProps extends ErrorComponentProps {
  /** 当前路由渲染过程中捕获到的错误。 */
  error: Error;
  /** 清除错误边界状态并重新尝试渲染。 */
  reset: () => void;
}

const ErrorPage = (props: ErrorPageProps) => {
  const { error, reset } = props;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center text-slate-900">
      <div className="text-sm font-medium uppercase tracking-[0.24em] text-rose-600">Application error</div>
      <h1 className="text-3xl font-semibold tracking-tight">页面加载失败</h1>
      <p className="max-w-xl text-sm leading-6 text-slate-600">{error.message}</p>
      <button
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        onClick={reset}
        type="button"
      >
        重新加载
      </button>
    </main>
  );
};

export default ErrorPage;
