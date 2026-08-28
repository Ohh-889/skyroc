import { createLink } from '@tanstack/react-router';
import type { LinkComponent, LinkComponentProps } from '@tanstack/react-router';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import type { Ref } from 'react';

interface ButtonLinkProps extends Omit<ButtonProps, 'type'> {
  /**
   * - Button type
   * - 因为link组件也有type属性,并且会吞掉button的type属性,所以需要单独传入
   */
  btnType?: ButtonProps['type'];
  ref?: Ref<HTMLAnchorElement>;
}

const ButtonLinkComponent = (props: ButtonLinkProps) => {
  const { btnType, ref, ...rest } = props;

  return (
    <Button
      type={btnType}
      {...rest}
      ref={ref}
    />
  );
};

export type ButtonLinkComponentProps = LinkComponentProps<typeof ButtonLinkComponent>;

const CreatedButtonLinkComponent = createLink(ButtonLinkComponent);

const ButtonLink: LinkComponent<typeof ButtonLinkComponent> = props => {
  return (
    <CreatedButtonLinkComponent
      preload="intent"
      {...props}
    />
  );
};

export default ButtonLink;
