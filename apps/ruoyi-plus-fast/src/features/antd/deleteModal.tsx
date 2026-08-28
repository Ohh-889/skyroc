import { showConfirmModal } from '@shell/theme';
import { SvgIcon } from '@shell/ui/compose';
import type { ModalFuncProps } from 'antd';
import type { ReactNode } from 'react';

export interface DeleteModalOptions {
  /** 删除操作的风险或影响说明。 */
  content: ReactNode;

  /** 确认按钮文案，默认显示“确认删除”。 */
  okText?: ReactNode;

  /** 用户确认删除后执行的业务操作。 */
  onOk: NonNullable<ModalFuncProps['onOk']>;

  /** 删除对象及操作名称。 */
  title: ReactNode;
}

/** 展示应用统一样式的删除确认弹窗。 */
export function deleteModal(options: DeleteModalOptions): ReturnType<typeof showConfirmModal> {
  const { content, okText = '确认删除', onOk, title } = options;

  return showConfirmModal({
    closable: true,
    content,
    icon: (
      <div className="mr-2.5 rounded-full bg-error-bg p-8px">
        <SvgIcon
          className="text-error text-18px"
          localIcon="menu-delete-warning"
        />
      </div>
    ),
    okButtonProps: { danger: true, ghost: true },
    okText,
    onOk,
    title
  });
}
