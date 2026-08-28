'use client';

import { Alert } from '@skyroc/web-ui';

const AlertWithDescription = () => {
  return (
    <Alert
      description="You can add components to your app using the cli."
      title="Heads up!"
      variant="pure"
    />
  );
};

export default AlertWithDescription;
