import { Link } from '@tanstack/react-router';

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-slate-900">
      <div className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-700">404</div>
      <h1 className="text-3xl font-semibold tracking-tight">没有找到这个页面</h1>
      <Link
        className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
        to="/"
      >
        返回工作台
      </Link>
    </main>
  );
};

export default NotFoundPage;
