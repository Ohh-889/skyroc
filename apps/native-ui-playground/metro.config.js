const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/**
 * Packages that MUST resolve to a single copy. Metro walks up the directory tree when resolving, so a workspace package
 * that carries its own devDependency copy of React would otherwise get bundled twice and blow up the dispatcher
 * ("invalid hook call"). Everything else keeps normal hierarchical resolution, which pnpm's nested node_modules layout
 * relies on.
 */
const SINGLETONS = new Set(['react', 'react-dom', 'react-native']);

const config = getDefaultConfig(projectRoot);

// Watch the whole monorepo so edits in packages/native/ui trigger a rebuild.
config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
];

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = defaultResolveRequest ?? context.resolveRequest;

  if (SINGLETONS.has(moduleName)) {
    return resolve({ ...context, originModulePath: path.join(projectRoot, 'index.js') }, moduleName, platform);
  }

  return resolve(context, moduleName, platform);
};

// withUniwindConfig must stay the OUTERMOST wrapper.
module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts'
});
