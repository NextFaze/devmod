import { getMetadata, getOwnMetadata, hasOwnMetadata } from '../util/metadata';
import { Observable } from 'rxjs';

import { CATEGORY_KEY } from '../decorators/developer-category';
import { DEV_FUN_KEY } from '../decorators/developer-function';
import { registeredCustomDeveloperModules } from '../decorators/developer-module';
import { OBSERVABLE_KEY } from '../decorators/developer-observable';
import { toTitle } from '../util/helpers';

export interface DeveloperMethodDescription {
  name: string;
  label: string;
  args: any;
}

export interface DeveloperItem {
  name: string;
  instance: any;
  nativeElement?: any;
  sort?: string;
  developerMethods: DeveloperMethodDescription[];
  type: string;
}

export abstract class ApplicationHandler {
  devItemCache = new Map();
  _cleanCache = new Map();
  constructor(public _app?: any) {}

  decoratedItems: Observable<DeveloperItem[]>;

  abstract probeForItemsWithDeveloperFunctions(): DeveloperItem[];
  protected abstract mapToDeveloperItem(item: any, type?: string): DeveloperItem;

  public getCustomDeveloperModules(): DeveloperItem[] {
    return Array.from(registeredCustomDeveloperModules)
      .filter(val => !!val)
      .filter(contructorItem => this.constructorIsDecorated(contructorItem))
      .map(contructorItem => new contructorItem())
      .map(instance => this.mapToDeveloperItem(instance, 'custom'));
  }

  getMappedDeveloperFunctions(constructor): DeveloperMethodDescription[] {
    return this.getDeveloperFunctions(constructor).map(method => ({
      name: method.key,
      label: method.label || toTitle(method.key),
      ...method
    }));
  }

  protected getCategoryConfig(constructor: any) {
    return getOwnMetadata(CATEGORY_KEY, constructor) || {};
  }

  // Constructor has one or more DeveloperFunction decorations
  protected constructorIsDecorated(constructor: any) {
    return hasOwnMetadata(DEV_FUN_KEY, constructor) || hasOwnMetadata(OBSERVABLE_KEY, constructor);
  }

  protected getDeveloperFunctions(component) {
    return getMetadata(DEV_FUN_KEY, component) || [];
  }

  protected getDebugObservables(component) {
    return getMetadata(OBSERVABLE_KEY, component) || [];
  }

  sortByOptionalKey(key: string, fallback: string, a: any, b: any) {
    return (a[key] ? a[key].toString() : a[fallback]).localeCompare(
      b[key] ? b[key].toString() : b[fallback]
    );
  }
}
