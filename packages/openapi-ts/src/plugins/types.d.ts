import type { IRContext } from '../ir/context';
import type { OpenApi } from '../openApi';
import type { Client } from '../types/client';
import type { Files } from '../types/utils';

export type Plugin<PluginConfig extends CommonConfig> = Omit<
  PluginConfig,
  '_dependencies' | '_handler' | '_handlerLegacy' | '_optionalDependencies'
> &
  Pick<Required<PluginConfig>, 'output'>;

export type PluginLegacyHandler<PluginConfig extends CommonConfig> = (args: {
  client: Client;
  files: Files;
  openApi: OpenApi;
  plugin: Plugin<PluginConfig>;
}) => void;

export type PluginHandler<PluginConfig extends CommonConfig> = (args: {
  context: IRContext;
  plugin: Plugin<PluginConfig>;
}) => void;

export type PluginNames =
  | '@hey-api/schemas'
  | '@hey-api/sdk'
  | '@hey-api/transformers'
  | '@hey-api/typescript'
  | '@tanstack/angular-query-experimental'
  | '@tanstack/react-query'
  | '@tanstack/solid-query'
  | '@tanstack/svelte-query'
  | '@tanstack/vue-query'
  | 'fastify'
  | 'zod';

export interface PluginName<Name extends PluginNames> {
  name: Name;
}

interface CommonConfig {
  // eslint-disable-next-line @typescript-eslint/ban-types
  name: PluginNames | (string & {});
  output?: string;
}

interface PluginDependencies {
  /**
   * Required dependencies will be always processed, regardless of whether
   * a user defines them in their `plugins` config.
   */
  _dependencies?: ReadonlyArray<PluginNames>;
  /**
   * Optional dependencies are not processed unless a user explicitly defines
   * them in their `plugins` config.
   */
  _optionalDependencies?: ReadonlyArray<PluginNames>;
}

export type DefaultPluginConfigsMap<T> = {
  [K in PluginNames]: CommonConfig &
    PluginDependencies & {
      _handler: PluginHandler<Required<Extract<T, { name: K }>>>;
      _handlerLegacy: PluginLegacyHandler<Required<Extract<T, { name: K }>>>;
    };
};

export type PluginConfig<Config extends CommonConfig> = Config &
  PluginDependencies & {
    _handler: PluginHandler<Config>;
    _handlerLegacy: PluginLegacyHandler<Config>;
  };

export type UserConfig<Config extends CommonConfig> = Omit<Config, 'output'>;

export type DefineConfig<Config extends CommonConfig> = (
  config?: UserConfig<Config>,
) => PluginConfig<Config>;
