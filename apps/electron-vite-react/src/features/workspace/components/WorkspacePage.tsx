import { Button, Card, Icon, Progress, Switch } from '@skyroc/web-ui';
import { useState } from 'react';

interface RecentWorkspace {
  /** 工作区的强调色。 */
  accent: string;
  /** 工作区最近活动说明。 */
  activity: string;
  /** 工作区名称。 */
  name: string;
  /** 工作区本地路径。 */
  path: string;
}

interface RecentFile {
  /** 文件所属工作区或来源。 */
  context: string;
  /** 文件类型标签。 */
  kind: string;
  /** 文件名称。 */
  name: string;
  /** 最近打开时间。 */
  time: string;
}

interface BackgroundTask {
  /** 与任务类型对应的图标。 */
  icon: string;
  /** 任务稳定标识。 */
  id: string;
  /** 任务完成百分比。 */
  progress: number;
  /** 面向用户的状态描述。 */
  status: string;
  /** 任务名称。 */
  title: string;
  /** 任务当前状态。 */
  type: 'done' | 'running';
}

interface EmptyWorkspaceProps {
  /** 创建首个工作区的回调。 */
  onCreate: () => void;
  /** 恢复示例数据的回调。 */
  onRestoreDemo: () => void;
}

interface WorkspacePageProps {}

const INITIAL_WORKSPACES: RecentWorkspace[] = [
  {
    accent: '#b7d679',
    activity: '刚刚编辑 · 12 个文件',
    name: 'Desktop Kit',
    path: '~/Projects/desktop-kit'
  },
  {
    accent: '#e2ad68',
    activity: '昨天同步 · 8 个文件',
    name: 'Release Notes',
    path: '~/Documents/release-notes'
  },
  {
    accent: '#88aaa4',
    activity: '3 天前打开 · 24 个文件',
    name: 'Research Archive',
    path: '~/Library/research-archive'
  }
];

const INITIAL_FILES: RecentFile[] = [
  { context: 'Desktop Kit', kind: 'MD', name: 'product-brief.md', time: '4 分钟前' },
  { context: 'Desktop Kit', kind: 'JSON', name: 'workspace.config.json', time: '28 分钟前' },
  { context: 'Release Notes', kind: 'PDF', name: 'release-v2.4.pdf', time: '昨天' },
  { context: 'Research Archive', kind: 'PNG', name: 'navigation-study.png', time: '周二' }
];

const BACKGROUND_TASKS: BackgroundTask[] = [
  {
    icon: 'lucide:scan-search',
    id: 'index',
    progress: 68,
    status: '已处理 1,284 / 1,890 个文件 · 约 34 秒',
    title: '构建本地搜索索引',
    type: 'running'
  },
  {
    icon: 'lucide:cloud-check',
    id: 'sync',
    progress: 100,
    status: '同步了 16 项更改 · 11:42',
    title: '同步 Desktop Kit',
    type: 'done'
  },
  {
    icon: 'lucide:file-archive',
    id: 'export',
    progress: 100,
    status: '导出 42.8 MB · 昨天',
    title: '归档 Release Notes',
    type: 'done'
  }
];

const QUICK_ACTIONS = [
  {
    description: '从一个干净目录开始',
    icon: 'lucide:folder-plus',
    id: 'create',
    label: '创建工作区'
  },
  {
    description: '选择本地文件夹',
    icon: 'lucide:folder-search',
    id: 'open',
    label: '打开目录'
  },
  {
    description: '添加现有文件',
    icon: 'lucide:file-up',
    id: 'import',
    label: '导入文件'
  }
] as const;

function getPathName(path: string) {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? 'Untitled Workspace';
}

const EmptyWorkspace = (props: EmptyWorkspaceProps) => {
  const { onCreate, onRestoreDemo } = props;

  return (
    <section
      className="workspace-enter grid min-h-[460px] place-items-center rounded-[26px] border border-dashed border-black/[0.13] bg-white/45 px-8 text-center"
      data-testid="workspace-empty"
    >
      <div className="max-w-md">
        <div className="relative mx-auto mb-7 grid size-24 place-items-center rounded-[28px] border border-black/[0.08] bg-[#eceae1] text-[#5c6f47] shadow-[0_18px_45px_rgba(45,50,39,0.09)]">
          <span className="absolute -right-2 -top-2 size-5 rounded-full bg-[#d7ef9b] shadow-[0_0_0_5px_#f8f7f2]" />
          <Icon
            height="38"
            icon="lucide:folder-kanban"
            width="38"
          />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c9087]">A clean beginning</p>
        <h2 className="mt-3 font-['Iowan_Old_Style','Palatino_Linotype',Georgia,serif] text-4xl tracking-[-0.035em] text-[#292d27]">
          你的工作台还很安静
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#777b72]">
          创建一个工作区，把本地文件、后台任务和同步进度收在同一个桌面里。
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button
            className="h-10 rounded-xl !bg-[#292e27] px-4 text-xs font-semibold !text-[#f4f5ef] shadow-[0_10px_24px_rgba(41,46,39,0.16)] hover:!bg-[#393f36]"
            onClick={onCreate}
            type="button"
          >
            创建首个工作区
          </Button>
          <Button
            className="h-10 rounded-xl border-black/10 bg-white/70 px-4 text-xs text-[#5e6259] shadow-none hover:bg-white"
            onClick={onRestoreDemo}
            type="button"
            variant="outline"
          >
            恢复示例数据
          </Button>
        </div>
      </div>
    </section>
  );
};

const WorkspacePage = (_props: WorkspacePageProps) => {
  const [showDemoData, setShowDemoData] = useState(true);
  const [recentWorkspaces, setRecentWorkspaces] = useState<RecentWorkspace[]>(INITIAL_WORKSPACES);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>(INITIAL_FILES);
  const [actionMessage, setActionMessage] = useState('工作区已恢复，可继续上次的工作');

  function handleCreateWorkspace() {
    const newWorkspace: RecentWorkspace = {
      accent: '#c8d2ef',
      activity: '刚刚创建 · 空工作区',
      name: 'Untitled Workspace',
      path: '~/Documents/untitled-workspace'
    };

    setRecentWorkspaces(current => [newWorkspace, ...current.filter(item => item.name !== newWorkspace.name)]);
    setShowDemoData(true);
    setActionMessage('已创建 Untitled Workspace');
  }

  async function handleOpenDirectory() {
    if (!window.desktopFiles) {
      setActionMessage('目录选择仅在 Electron 桌面环境中可用');
      return;
    }

    const paths = await window.desktopFiles.openDirectory();
    const [selectedPath] = paths;

    if (!selectedPath) return;

    const workspaceName = getPathName(selectedPath);
    const newWorkspace: RecentWorkspace = {
      accent: '#d9c990',
      activity: '刚刚打开 · 正在建立索引',
      name: workspaceName,
      path: selectedPath
    };

    setRecentWorkspaces(current => [newWorkspace, ...current.filter(item => item.path !== selectedPath)]);
    setShowDemoData(true);
    setActionMessage(`已打开目录 ${workspaceName}`);
  }

  async function handleImportFiles() {
    if (!window.desktopFiles) {
      setActionMessage('文件导入仅在 Electron 桌面环境中可用');
      return;
    }

    const paths = await window.desktopFiles.importFiles();

    if (paths.length === 0) return;

    const importedFiles: RecentFile[] = paths.map(path => {
      const name = getPathName(path);
      const extension = name.split('.').at(-1)?.toUpperCase() ?? 'FILE';

      return { context: '本地导入', kind: extension, name, time: '刚刚' };
    });

    setRecentFiles(current => [...importedFiles, ...current]);
    setShowDemoData(true);
    setActionMessage(`已导入 ${paths.length} 个文件`);
  }

  async function handleQuickAction(actionId: (typeof QUICK_ACTIONS)[number]['id']) {
    if (actionId === 'create') {
      handleCreateWorkspace();
      return;
    }

    if (actionId === 'open') {
      await handleOpenDirectory();
      return;
    }

    await handleImportFiles();
  }

  function handleWorkspaceOpen(workspace: RecentWorkspace) {
    setActionMessage(`已切换到 ${workspace.name}`);
  }

  function handleFileOpen(file: RecentFile) {
    setActionMessage(`已打开 ${file.name}`);
  }

  function handleDemoDataChange(checked: boolean) {
    setShowDemoData(checked);
    setActionMessage(checked ? '已载入模板示例数据' : '已切换到新用户空状态');
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] px-6 py-6 xl:px-8 xl:py-7">
      <header className="workspace-enter flex items-end justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7c8177]">
            <span className="h-px w-7 bg-[#98a485]" />
            Friday · Local workspace
          </div>
          <h1 className="font-['Iowan_Old_Style','Palatino_Linotype',Georgia,serif] text-[42px] leading-none font-normal tracking-[-0.045em] text-[#262a24]">
            上午好，Shipeng
          </h1>
          <p className="mt-3 text-[13px] text-[#74786f]">继续正在进行的工作，或从一个本地目录开始。</p>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-black/[0.08] bg-white/65 px-3 py-2 text-xs text-[#676b62] shadow-[0_4px_16px_rgba(38,43,35,0.035)]">
          <span>示例数据</span>
          <Switch
            aria-label="切换示例数据"
            checked={showDemoData}
            classNames={{
              root: 'data-[state=checked]:bg-[#718b50]',
              thumb: 'bg-white'
            }}
            data-testid="demo-data-toggle"
            onCheckedChange={handleDemoDataChange}
            size="sm"
          />
        </div>
      </header>

      <div
        aria-live="polite"
        className="mt-5 flex h-7 items-center gap-2 text-[11px] text-[#858980]"
      >
        <Icon
          className="text-[#7e9660]"
          height="13"
          icon="lucide:sparkles"
          width="13"
        />
        {actionMessage}
      </div>

      {!showDemoData ? (
        <EmptyWorkspace
          onCreate={handleCreateWorkspace}
          onRestoreDemo={() => handleDemoDataChange(true)}
        />
      ) : (
        <div
          className="workspace-enter-delay grid grid-cols-12 gap-4"
          data-testid="workspace-dashboard"
        >
          <section className="col-span-12 xl:col-span-8">
            <Card
              className="overflow-hidden rounded-[22px] border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.055)]"
              classNames={{ content: 'p-0' }}
              header={
                <div className="flex w-full items-center justify-between border-b border-black/[0.07] px-5 py-4">
                  <div>
                    <h2 className="text-sm font-semibold text-[#343831]">最近工作区</h2>
                    <p className="mt-1 text-[11px] text-[#8a8e85]">回到最近离开的地方</p>
                  </div>
                  <button
                    className="text-[11px] font-medium text-[#6f8058] transition hover:text-[#40502e]"
                    onClick={() => setActionMessage('已显示全部工作区')}
                    type="button"
                  >
                    查看全部
                  </button>
                </div>
              }
            >
              <div className="grid divide-y divide-black/[0.06] md:grid-cols-3 md:divide-x md:divide-y-0">
                {recentWorkspaces.slice(0, 3).map(workspace => (
                  <button
                    className="group min-w-0 p-5 text-left transition hover:bg-[#f2f3eb]"
                    key={workspace.path}
                    onClick={() => handleWorkspaceOpen(workspace)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="grid size-10 place-items-center rounded-[13px] text-xs font-bold text-[#30342d] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
                        style={{ backgroundColor: workspace.accent }}
                      >
                        {workspace.name.slice(0, 1)}
                      </span>
                      <Icon
                        className="mt-1 text-[#b3b6ae] transition group-hover:translate-x-0.5 group-hover:text-[#697b51]"
                        height="15"
                        icon="lucide:arrow-up-right"
                        width="15"
                      />
                    </div>
                    <h3 className="mt-5 truncate text-[13px] font-semibold text-[#353a32]">{workspace.name}</h3>
                    <p className="mt-1.5 truncate font-mono text-[10px] text-[#92968d]">{workspace.path}</p>
                    <p className="mt-4 text-[10px] text-[#7f837a]">{workspace.activity}</p>
                  </button>
                ))}
              </div>
            </Card>
          </section>

          <section className="col-span-12 xl:col-span-4">
            <Card
              className="h-full overflow-hidden rounded-[22px] border-[#2b3028] bg-[#292e27] text-[#eff1e9] shadow-[0_18px_45px_rgba(34,39,32,0.15)]"
              classNames={{ content: 'p-5' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">快速开始</h2>
                  <p className="mt-1 text-[11px] text-[#aeb5a6]">桌面操作，一步到位</p>
                </div>
                <span className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-[#d5ed9d]">
                  <Icon
                    height="15"
                    icon="lucide:zap"
                    width="15"
                  />
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {QUICK_ACTIONS.map(action => (
                  <button
                    className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3 text-left transition hover:-translate-y-px hover:border-white/[0.14] hover:bg-white/[0.075]"
                    data-testid={`quick-action-${action.id}`}
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    type="button"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#d9ef9f] text-[#273020]">
                      <Icon
                        height="17"
                        icon={action.icon}
                        width="17"
                      />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold text-[#f0f2eb]">{action.label}</span>
                      <span className="mt-0.5 block text-[10px] text-[#9fa69a]">{action.description}</span>
                    </span>
                    <Icon
                      className="ml-auto text-[#747c70] transition group-hover:translate-x-0.5 group-hover:text-[#d9ef9f]"
                      height="15"
                      icon="lucide:chevron-right"
                      width="15"
                    />
                  </button>
                ))}
              </div>
            </Card>
          </section>

          <section className="col-span-12 lg:col-span-7 xl:col-span-5">
            <Card
              className="h-full overflow-hidden rounded-[22px] border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]"
              classNames={{ content: 'p-0' }}
              header={
                <div className="flex w-full items-center justify-between border-b border-black/[0.07] px-5 py-4">
                  <div>
                    <h2 className="text-sm font-semibold text-[#343831]">最近文件</h2>
                    <p className="mt-1 text-[11px] text-[#8a8e85]">跨工作区继续编辑</p>
                  </div>
                  <Icon
                    className="text-[#9b9f96]"
                    height="16"
                    icon="lucide:files"
                    width="16"
                  />
                </div>
              }
            >
              <div className="divide-y divide-black/[0.06]">
                {recentFiles.slice(0, 4).map(file => (
                  <button
                    className="group flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#f2f3eb]"
                    key={`${file.context}-${file.name}`}
                    onClick={() => handleFileOpen(file)}
                    type="button"
                  >
                    <span className="grid h-9 w-10 shrink-0 place-items-center rounded-lg border border-black/[0.07] bg-[#f0efe9] font-mono text-[9px] font-bold text-[#69705f]">
                      {file.kind}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium text-[#3d413a]">{file.name}</span>
                      <span className="mt-0.5 block truncate text-[10px] text-[#92968d]">{file.context}</span>
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] text-[#a1a49d] transition group-hover:text-[#70766a]">
                      {file.time}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </section>

          <section className="col-span-12 lg:col-span-5 xl:col-span-4">
            <Card
              className="h-full overflow-hidden rounded-[22px] border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]"
              classNames={{ content: 'p-0' }}
              header={
                <div className="flex w-full items-center justify-between border-b border-black/[0.07] px-5 py-4">
                  <div>
                    <h2 className="text-sm font-semibold text-[#343831]">后台任务</h2>
                    <p className="mt-1 text-[11px] text-[#8a8e85]">1 项正在运行</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#edf2e4] px-2 py-1 text-[9px] font-semibold text-[#647a4c]">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#789552]" />
                    ACTIVE
                  </span>
                </div>
              }
            >
              <div className="divide-y divide-black/[0.06]">
                {BACKGROUND_TASKS.map(task => (
                  <div
                    className="px-5 py-3.5"
                    key={task.id}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-lg ${task.type === 'running' ? 'bg-[#e5eed7] text-[#627c43]' : 'bg-[#efeee9] text-[#8b8f86]'}`}
                      >
                        <Icon
                          height="15"
                          icon={task.icon}
                          width="15"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-xs font-medium text-[#42463f]">{task.title}</span>
                          <span className="text-[9px] text-[#92968d]">{task.progress}%</span>
                        </div>
                        <p className="mt-0.5 truncate text-[9px] text-[#999c95]">{task.status}</p>
                      </div>
                    </div>
                    {task.type === 'running' ? (
                      <Progress
                        className="mt-3 h-1 bg-[#dde3d4]"
                        classNames={{ indicator: 'bg-[#718c4e]' }}
                        value={task.progress}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="col-span-12 xl:col-span-3">
            <div className="grid h-full gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <article className="rounded-[20px] border border-black/[0.08] bg-[#eef2e7] p-4 shadow-[0_12px_32px_rgba(39,44,35,0.04)]">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/75 text-[#648044] shadow-sm">
                    <Icon
                      height="17"
                      icon="lucide:cloud-check"
                      width="17"
                    />
                  </span>
                  <span className="flex items-center gap-1.5 text-[9px] font-semibold text-[#67804e]">
                    <span className="size-1.5 rounded-full bg-[#78a04d]" />在线
                  </span>
                </div>
                <h2 className="mt-5 text-xs font-semibold text-[#3a4035]">同步状态良好</h2>
                <p className="mt-1.5 text-[10px] leading-4 text-[#7d8477]">全部更改已安全同步，最近同步于 11:42。</p>
              </article>

              <article className="relative overflow-hidden rounded-[20px] border border-[#e0c69c] bg-[#f5e8d2] p-4 shadow-[0_12px_32px_rgba(95,68,30,0.06)]">
                <div className="absolute -right-5 -top-5 size-20 rounded-full border border-[#d7b87f]/35" />
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/65 text-[#9a6933] shadow-sm">
                    <Icon
                      height="17"
                      icon="lucide:package-open"
                      width="17"
                    />
                  </span>
                  <span className="rounded-full bg-[#d9954c] px-2 py-0.5 text-[8px] font-bold tracking-[0.08em] text-white">
                    NEW
                  </span>
                </div>
                <h2 className="mt-5 text-xs font-semibold text-[#523c27]">Skyroc 2.4.0</h2>
                <p className="mt-1.5 text-[10px] leading-4 text-[#8a7055]">新版本已可用，包含任务恢复和索引性能改进。</p>
                <button
                  className="mt-3 text-[10px] font-semibold text-[#855828] underline decoration-[#b98a59]/45 underline-offset-4"
                  onClick={() => setActionMessage('更新详情已准备好，将在更新面板中打开')}
                  type="button"
                >
                  查看更新详情
                </button>
              </article>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
