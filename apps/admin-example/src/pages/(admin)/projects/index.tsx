import { SvgIcon } from '@shell/ui/compose';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Typography } from 'antd';

type ProjectStatus = 'active' | 'planning' | 'review';

interface ProjectExample {
  /** 示例编辑记录 ID，用于演示多级动态路由参数。 */
  editId: string;

  /** 示例项目负责人，用于让列表更接近真实业务入口。 */
  owner: string;

  /** 示例项目 ID，对应路由中的 $pid。 */
  pid: string;

  /** 示例项目状态，用于区分不同入口的业务语义。 */
  status: ProjectStatus;

  /** 示例项目描述，用于说明打开详情页后看到的上下文。 */
  summary: string;

  /** 示例项目名称，用于列表展示。 */
  title: string;
}

const DEFAULT_PROJECT: ProjectExample = {
  editId: 'release-plan',
  owner: 'Admin Team',
  pid: 'admin-platform',
  status: 'active',
  summary: '演示项目详情页和编辑页如何共享同一个 pid 参数。',
  title: 'Admin Platform'
};

const PROJECT_EXAMPLES: ProjectExample[] = [
  DEFAULT_PROJECT,
  {
    editId: 'permission-flow',
    owner: 'Access Team',
    pid: 'permission-center',
    status: 'review',
    summary: '演示权限模块中从项目详情进入具体配置记录的路径。',
    title: 'Permission Center'
  },
  {
    editId: 'theme-tokens',
    owner: 'Design System',
    pid: 'design-system',
    status: 'planning',
    summary: '演示设计系统项目下的多级编辑路由参数。',
    title: 'Design System'
  }
];

const projectStatusLabelRecord: Record<ProjectStatus, string> = {
  active: '运行中',
  planning: '规划中',
  review: '评审中'
};

const projectStatusColorRecord: Record<ProjectStatus, string> = {
  active: 'green',
  planning: 'blue',
  review: 'orange'
};

const Projects = () => {
  const navigate = useNavigate();

  function goProject(pid: string) {
    navigate({ params: { pid }, to: '/projects/$pid' });
  }

  function goProjectEdit(pid: string, id: string) {
    navigate({ params: { id, pid }, to: '/projects/$pid/edit/$id' });
  }

  function goDefaultProject() {
    goProject(DEFAULT_PROJECT.pid);
  }

  function goDefaultProjectEdit() {
    goProjectEdit(DEFAULT_PROJECT.pid, DEFAULT_PROJECT.editId);
  }

  function renderProject(project: ProjectExample) {
    const editPath = `/projects/${project.pid}/edit/${project.editId}`;
    const detailPath = `/projects/${project.pid}`;

    return (
      <ACol key={project.pid} lg={8} md={12} span={24}>
        <ACard className="h-full card-wrapper" size="small" variant="borderless">
          <div className="h-full flex flex-col gap-16px">
            <div className="flex items-start justify-between gap-12px">
              <div>
                <Typography.Title className="m-0!" level={5}>
                  {project.title}
                </Typography.Title>
                <Typography.Text type="secondary">{project.owner}</Typography.Text>
              </div>

              <ATag color={projectStatusColorRecord[project.status]}>{projectStatusLabelRecord[project.status]}</ATag>
            </div>

            <Typography.Paragraph className="m-0!" type="secondary">
              {project.summary}
            </Typography.Paragraph>

            <div className="rounded-6px bg-layout p-12px text-13px font-mono">
              <div className="break-all">{detailPath}</div>
              <div className="mt-6px break-all text-secondary">{editPath}</div>
            </div>

            <ASpace className="mt-auto" wrap>
              <AButton icon={<SvgIcon icon="mdi:folder-open-outline" />} onClick={() => goProject(project.pid)}>
                打开详情
              </AButton>
              <AButton
                icon={<SvgIcon icon="mdi:file-document-edit-outline" />}
                type="primary"
                onClick={() => goProjectEdit(project.pid, project.editId)}
              >
                编辑记录
              </AButton>
            </ASpace>
          </div>
        </ACard>
      </ACol>
    );
  }

  return (
    <ASpace className="w-full" direction="vertical" size={16}>
      <ACard className="card-wrapper" size="small" variant="borderless">
        <div className="flex flex-col gap-16px lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Typography.Title className="m-0!" level={4}>
              Projects 动态路由入口
            </Typography.Title>
            <Typography.Paragraph className="mb-0! mt-8px!" type="secondary">
              直接访问 /projects 时，先在这里选择一个项目，再进入 /projects/$pid 或 /projects/$pid/edit/$id。
            </Typography.Paragraph>
          </div>

          <ASpace wrap>
            <AButton icon={<SvgIcon icon="mdi:folder-open-outline" />} onClick={goDefaultProject}>
              打开默认详情
            </AButton>
            <AButton
              icon={<SvgIcon icon="mdi:file-document-edit-outline" />}
              type="primary"
              onClick={goDefaultProjectEdit}
            >
              打开默认编辑
            </AButton>
          </ASpace>
        </div>
      </ACard>

      <ARow gutter={[16, 16]}>{PROJECT_EXAMPLES.map(renderProject)}</ARow>
    </ASpace>
  );
};

export const Route = createFileRoute('/(admin)/projects/')({
  component: Projects
});
