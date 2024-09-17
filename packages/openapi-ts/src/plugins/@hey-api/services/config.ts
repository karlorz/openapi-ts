import type { PluginConfig } from './types';

export const defaultConfig: Required<PluginConfig> = {
  handler: () => {},
  name: '@hey-api/services',
  output: 'services',
};