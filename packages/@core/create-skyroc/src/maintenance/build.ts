import { execa } from 'execa';

import { getPackageRoot } from '../shared/paths';
import { prepareTemplateAssets } from './prepare-template-assets';

const packageRoot = getPackageRoot();

await execa('tsdown', [], { cwd: packageRoot, stdio: 'inherit' });
await prepareTemplateAssets();
