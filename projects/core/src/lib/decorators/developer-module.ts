import { CategoryConfig, DeveloperCategory } from '../decorators/developer-category';
import { isDebugMode } from '../util/enable';

export const registeredCustomDeveloperModules = new Set();

export function DeveloperModule(config?: CategoryConfig) {
  return function(targetConstructor) {
    if (!isDebugMode()) {
      return;
    }
    registeredCustomDeveloperModules.add(targetConstructor);
    DeveloperCategory(config)(targetConstructor);
  };
}
