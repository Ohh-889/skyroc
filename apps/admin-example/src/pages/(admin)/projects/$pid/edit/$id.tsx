import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { Typography } from 'antd';

interface ProjectEditRouteParams {
  /** 当前编辑记录标识。 */
  id: string;

  /** 当前项目标识。 */
  pid: string;
}

const ProjectsEditId = () => {
  const { id, pid } = useParams({ strict: false }) as ProjectEditRouteParams;
  const navigate = useNavigate();

  function goProjects() {
    navigate({ to: '/projects' });
  }

  function goProjectDetail() {
    navigate({ params: { pid }, to: '/projects/$pid' });
  }

  return (
    <ACard
      className="h-full card-wrapper"
      size="small"
      variant="borderless"
    >
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-full">
          <div className="overflow-hidden border border-border rounded-8px bg-container">
            <div className="bg-primary px-24px py-20px">
              <Typography.Title
                className="m-0! text-white!"
                level={4}
              >
                项目编辑
              </Typography.Title>
              <Typography.Text className="text-white/75">正在编辑项目的详细信息</Typography.Text>
            </div>

            <div className="p-24px">
              <div className="grid grid-cols-1 gap-16px md:grid-cols-2">
                <div className="border border-border-secondary rounded-8px p-16px">
                  <Typography.Text type="secondary">Project ID (PID)</Typography.Text>
                  <div className="mt-8px break-all text-20px font-semibold font-mono">{pid}</div>
                </div>

                <div className="border border-border-secondary rounded-8px p-16px">
                  <Typography.Text type="secondary">Edit ID</Typography.Text>
                  <div className="mt-8px break-all text-20px font-semibold font-mono">{id}</div>
                </div>
              </div>

              <div className="mt-24px rounded-6px bg-layout p-16px">
                <Typography.Text type="secondary">当前路径</Typography.Text>
                <div className="mt-8px overflow-x-auto rounded-4px bg-container p-12px text-14px font-mono">
                  <span className="text-tertiary">/projects/</span>
                  <span className="text-primary">{pid}</span>
                  <span className="text-tertiary">/edit/</span>
                  <span className="text-primary">{id}</span>
                </div>
              </div>

              <ASpace className="mt-24px">
                <AButton onClick={goProjects}>返回项目入口</AButton>
                <AButton onClick={goProjectDetail}>返回项目详情</AButton>
                <AButton
                  type="primary"
                  onClick={goProjectDetail}
                >
                  保存并返回详情
                </AButton>
              </ASpace>
            </div>
          </div>
        </div>
      </div>
    </ACard>
  );
};

export const Route = createFileRoute('/(admin)/projects/$pid/edit/$id')({
  component: ProjectsEditId,
  staticData: {
    i18nKey: 'route.projects_$pid_edit_$id',
    menu: {
      activeMenu: '/projects',
      hide: true
    },
    title: 'projects_$pid_edit_$id'
  }
});
