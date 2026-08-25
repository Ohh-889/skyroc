import { Link } from '@tanstack/react-router';
import { clsx } from 'clsx';

import type { AdminLayoutLogoProps } from '../context';
import { getAdminLayoutsOptions } from '../setup';

const AdminLogo = (props: AdminLayoutLogoProps) => {
  const { className, logo, showTitle = true, style, title, to } = props;

  const targetPath = to ?? getAdminLayoutsOptions().defaultHome;

  return (
    <Link className={clsx('w-full flex-center nowrap-hidden', className)} style={style} to={targetPath}>
      {logo}

      {title ? (
        <h2
          className="pl-8px text-md text-primary font-bold transition duration-300 ease-in-out"
          style={{ display: showTitle ? 'block' : 'none' }}
        >
          {title}
        </h2>
      ) : null}
    </Link>
  );
};

export default AdminLogo;
