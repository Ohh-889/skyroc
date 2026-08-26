import { runCreateSkyrocCli } from '../cli';
import { getTemplateAssetsDir, getWorkspaceRoot } from '../shared/paths';
import { prepareTemplateAssets } from './prepare-template-assets';

const workspaceRoot = getWorkspaceRoot();
const templateAssetsDir = getTemplateAssetsDir();

await prepareTemplateAssets({ targetDir: templateAssetsDir, workspaceRoot });
await runCreateSkyrocCli({ cwd: workspaceRoot, defaultWorkspace: true, templateAssetsDir });
