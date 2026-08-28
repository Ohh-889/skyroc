import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { Typography } from 'antd';

interface ProjectRouteParams {
  /** 当前项目标识。 */
  pid: string;
}

const ProjectDetail = () => {
  const { pid } = useParams({ strict: false }) as ProjectRouteParams;
  const navigate = useNavigate();

  function goProjects() {
    navigate({ to: '/projects' });
  }

  function goProjectEdit() {
    navigate({ params: { id: 'release-plan', pid }, to: '/projects/$pid/edit/$id' });
  }

  return (
    <ACard
      className="h-full card-wrapper"
      size="small"
      variant="borderless"
    >
      <div className="w-full flex justify-center">
        <div className="w-full px-4">
          <div className="overflow-hidden border border-border rounded-8px bg-container">
            <div className="bg-primary px-24px py-20px">
              <Typography.Title
                className="m-0! text-white!"
                level={4}
              >
                项目详情
              </Typography.Title>
              <Typography.Text className="text-white/75">显示当前动态路由参数</Typography.Text>
            </div>

            <div className="p-24px">
              <div className="mb-24px rounded-6px bg-layout p-16px">
                <Typography.Text type="secondary">项目标识 (PID)</Typography.Text>
                <div className="mt-8px break-all text-20px font-semibold font-mono">{pid}</div>
              </div>

              <ASpace>
                <AButton onClick={goProjects}>返回项目入口</AButton>
                <AButton
                  type="primary"
                  onClick={goProjectEdit}
                >
                  编辑示例记录
                </AButton>
              </ASpace>
            </div>
          </div>
        </div>
      </div>
    </ACard>
  );
};

export const Route = createFileRoute('/(admin)/projects/$pid/')({
  component: ProjectDetail,
  staticData: {
    i18nKey: 'route.projects_$pid',
    menu: {
      activeMenu: '/projects',
      hide: true,
      icon: 'material-symbols-light:attachment'
    },
    title: 'projects_$pid'
  }
});
