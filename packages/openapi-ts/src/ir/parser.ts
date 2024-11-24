import type { IRContext } from './context';
import type { IRPathItemObject, IRPathsObject } from './ir';

/**
 * Traverse the parsed intermediate representation model and broadcast
 * various events to listeners.
 */
export const parseIR = async ({ context }: { context: IRContext }) => {
  await context.broadcast('before');

  if (context.ir.components) {
    for (const name in context.ir.components.schemas) {
      const schema = context.ir.components.schemas[name];
      const $ref = `#/components/schemas/${name}`;
      await context.broadcast('schema', { $ref, name, schema });
    }

    for (const name in context.ir.components.parameters) {
      const parameter = context.ir.components.parameters[name];
      const $ref = `#/components/parameters/${name}`;
      await context.broadcast('parameter', { $ref, name, parameter });
    }
  }

  for (const path in context.ir.paths) {
    const pathItem = context.ir.paths[path as keyof IRPathsObject];

    for (const _method in pathItem) {
      const method = _method as keyof IRPathItemObject;
      const operation = pathItem[method]!;
      await context.broadcast('operation', { method, operation, path });
    }
  }

  await context.broadcast('after');
};