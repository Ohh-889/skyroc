import { clsx } from 'clsx';

interface Props extends React.ComponentProps<'div'> {
  inverted?: boolean;
}

const DarkModeContainer = ({ children, className, inverted, ...rest }: Props) => {
  return (
    <div
      className={clsx(
        'bg-container text-base-text transition-300',
        { 'bg-inverted text-#1f1f1f': inverted },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default DarkModeContainer;
