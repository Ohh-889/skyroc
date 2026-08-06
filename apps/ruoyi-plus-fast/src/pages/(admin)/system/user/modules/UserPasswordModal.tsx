import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';

interface PasswordValues {
  password: string;
}

interface UserPasswordModalProps {
  /** 请求是否执行中。 */
  loading: boolean;
  /** 关闭密码弹窗。 */
  onClose: () => void;
  /** 提交新密码。 */
  onSubmit: (password: string) => Promise<void>;
  /** 弹窗是否打开。 */
  open: boolean;
  /** 当前用户名。 */
  userName: string;
}

const UserPasswordModal = (props: UserPasswordModalProps) => {
  const { loading, onClose, onSubmit, open, userName } = props;
  const [form] = Form.useForm<PasswordValues>();

  useEffect(() => {
    if (open) form.resetFields();
  }, [form, open]);

  async function handleOk() {
    const values = await form.validateFields();
    await onSubmit(values.password);
  }

  return (
    <Modal
      confirmLoading={loading}
      open={open}
      title={`重置“${userName}”的密码`}
      onCancel={onClose}
      onOk={handleOk}>
      <Form className='px-22px pt-1' form={form} layout="vertical">
        <Form.Item
          label="新密码"
          name="password"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 5, max: 64, message: '密码长度为 5 至 64 位' }
          ]}
        >
          <Input.Password autoComplete="new-password" placeholder="请输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserPasswordModal;
