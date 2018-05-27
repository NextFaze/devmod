import { defineMetadata } from '../util/metadata';
import { isDebugMode } from '../util/enable';

export const CATEGORY_KEY = 'DEVELOPER_CATEGORY';

export type CategoryConfig =
  | string
  | {
      name?: string;
      sort?: string | number;
      [key: string]: any;
    };

export function DeveloperCategory(config: CategoryConfig) {
  return function(targetConstructor) {
    if (!isDebugMode()) {
      return;
    }
    if (typeof config === 'string') {
      config = { name: config };
    }
    defineMetadata(CATEGORY_KEY, config, targetConstructor);
  };
}
