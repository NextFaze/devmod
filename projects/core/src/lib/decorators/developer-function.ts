import { defineMetadata, getOwnMetadata } from '../util/metadata';
import { isDebugMode } from '../util/enable';

export const DEV_FUN_KEY = `DEVELOPER_FUNCTIONS`;

export interface DeveloperFunctionOptions {
  label?: string;
  args?: any;
  sort?: number | string;
  [key: string]: any;
}

export function DeveloperFunction(
  opts: DeveloperFunctionOptions | DeveloperFunctionOptions[] | string = {}
) {
  return function(target: any, key: string) {
    if (!isDebugMode()) {
      return;
    }
    if (typeof opts === 'string') {
      opts = { label: opts };
    }
    const metaTarget = target.constructor;
    const developerFunctions = getOwnMetadata(DEV_FUN_KEY, metaTarget) || [];
    if (Array.isArray(opts)) {
      opts.forEach(opt => {
        developerFunctions.push({
          key,
          ...opt
        });
      });
    } else {
      developerFunctions.push({ key, ...opts });
    }

    defineMetadata(DEV_FUN_KEY, developerFunctions, metaTarget);
  };
}
