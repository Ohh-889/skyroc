'use client';

import { Alert } from '@skyroc/web-ui';
import { Rocket } from 'lucide-react';

const AlertWithIcon = () => {
  return (
    <Alert
      color="success"
      icon={<Rocket />}
      title="Flighting !!!"
      variant="outline"
    />
  );
};

export default AlertWithIcon;
