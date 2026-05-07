const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.disableHierarchicalLookup = false;

config.resolver.extraNodeModules = {
  '@engine':  path.resolve(workspaceRoot, 'engine'),
  '@design':  path.resolve(workspaceRoot, 'design'),
  '@content': path.resolve(workspaceRoot, 'content'),
};

module.exports = config;
