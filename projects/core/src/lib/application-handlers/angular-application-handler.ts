import { DebugElement, NgZone } from '@angular/core';
import { of } from 'rxjs';
import { distinctUntilChanged, map, throttleTime } from 'rxjs/operators';

import { toTitle } from '../util/helpers';
import { ApplicationHandler, DeveloperItem } from './application-handler';

export abstract class AngularMethods {
  getAllAngularRootElements: Function;
  getAngularApplicationRoot: Function;
  getAngularModuleInstance: Function;
  isDebugElementComponent: Function;
  resolveNgModuleDecoratorConfig: Function;
  coreTokens: any;
  probe: Function;
}

export class AngularApplicationDebugger extends ApplicationHandler {
  constructor(public app: any, public skipInjectors: any[] = [], public ng: AngularMethods) {
    super();

    if (!this.ng || !this.app) {
      throw new Error(`Angular must be running in development mode.`);
    }

    try {
      this.decoratedItems = this.zone.onStable.pipe(
        throttleTime(500),
        map(() => this.probeForItemsWithDeveloperFunctions()),
        distinctUntilChanged(this.allItemsMatch.bind(this))
      );
    } catch (ex) {
      this.decoratedItems = of([]);
    }
  }

  get zone(): NgZone {
    return this.app.injector.get(this.ng.coreTokens.NgZone);
  }

  probeForProviders() {
    const ngModuleDecorators = this.ng.getAngularModuleInstance().constructor;
    const allProviders = this.resolveAllProvidersFromModule(ngModuleDecorators);
    const flattenedProviders = this.flatten(allProviders).map(item => this.mapToProvider(item));
    const reservedClasses = ['State', 'Store', 'Actions']; // RxJS classes - avoid getting two stores

    const filtered = flattenedProviders.filter(provider => {
      if (provider.provide && provider.provide.name) {
        if (reservedClasses.indexOf(provider.provide.name) >= 0) {
          return false;
        }
        if (this.skipInjectors.indexOf(provider.provide) >= 0) {
          return false;
        }
      }
      return true;
    });

    return filtered
      .map(provider => {
        try {
          return this.app.injector.get(provider.provide);
        } catch (ex) {
          return;
        }
      })
      .filter(val => val && val.constructor);
  }

  flatten(array: any[]) {
    return array.reduce(
      (prev, next) => (Array.isArray(next) ? prev.concat(this.flatten(next)) : prev.concat(next)),
      []
    );
  }

  mapToProvider(item) {
    // Normalize each item to an angular style provider.
    return item.provide ? item : { provide: item, useClass: item };
  }

  getDeclaredComponentsFromRoot(includeChildren: boolean) {
    return this.flatten(
      this.getAllDeclaredComponentsFromModule(
        this.ng.getAngularModuleInstance().constructor,
        includeChildren
      )
    );
  }

  getAllDeclaredComponentsFromModule(moduleClass, includeChildren?: boolean) {
    const root = this.getModuleRoot(moduleClass);
    const components = root.declarations || [];

    const childDeclarations =
      includeChildren && root.imports
        ? root.imports.map(imported =>
            this.getAllDeclaredComponentsFromModule(imported, includeChildren)
          )
        : [];

    return components.concat(childDeclarations);
  }

  getModuleRoot(moduleClass) {
    if (!moduleClass) {
      return [];
    }
    let root = this.ng.resolveNgModuleDecoratorConfig(moduleClass);
    if (!root) {
      if (moduleClass.ngModule) {
        root = moduleClass;
      } else {
        return [];
      }
    }
    return root;
  }

  resolveAllProvidersFromModule(moduleClass) {
    const root = this.getModuleRoot(moduleClass);
    const providers = root.providers || [];
    const childProviders = root.imports
      ? root.imports.map(imported => this.resolveAllProvidersFromModule(imported))
      : [];

    return providers.concat(childProviders);
  }

  // Custom differ since we are always getting new objects for every iteration
  allItemsMatch(prev, next) {
    try {
      if (prev.length !== next.length) {
        return false;
      }
      for (let i = 0; i < prev.length; i++) {
        if (
          prev[i].name !== next[i].name ||
          prev[i].developerMethods.length !== next[i].developerMethods.length
        ) {
          return false;
        }
      }
    } catch (ex) {
      return false;
    }
    return true;
  }

  probeForItemsWithDeveloperFunctions(): DeveloperItem[] {
    this._cleanCache.clear();
    const items = [
      ...this.probeForComponentsWithDeveloperFunctions(),
      ...this.probeForProvidersWithDeveloperFunctions(),
      ...this.getCustomDeveloperModules()
    ].sort(this.sortByOptionalKey.bind(this, 'sort', 'name'));
    this.devItemCache = new Map(this._cleanCache);
    return items;
  }

  // Return a flattened list of all components in the application
  probeForComponents(): any[] {
    if (!this.app) {
      return [];
    }
    // We go off the document body instead of the angular app root to catch items outside the root app tree like CDK overlays
    const componentTree = this.drillForChildren(document.body);
    const allComponents = this.flattenComponentTree(componentTree).filter(
      this.ng.isDebugElementComponent
    );
    return allComponents;
  }

  probeForComponentsWithDeveloperFunctions(): DeveloperItem[] {
    return this.probeForComponents()
      .filter(component => this.constructorIsDecorated(component.componentInstance.constructor))
      .map(item => this.mapToDeveloperItem(item, 'component'));
  }

  probeForServices() {
    const services = new Set();
    this.probeForComponents().map(component => {
      const providers = component.injector.elDef.element.allProviders;
      for (component in providers) {
        if (providers[component]) {
          const provider = providers[component];
          const deps = provider.provider.deps;
          // injectedDeps:
          deps.forEach(dep => {
            const service = this.retrieveDependencyFromInjector(dep, component);
            if (service) {
              services.add(service);
            }
          });
        }
      }
    });
    return Array.from(services).filter(Boolean);
  }

  probeForProvidersWithDeveloperFunctions(): DeveloperItem[] {
    return this.probeForProviders()
      .filter(service => this.constructorIsDecorated(service.constructor))
      .map(item => this.mapToDeveloperItem(item, 'service'));
  }

  private retrieveDependencyFromInjector(dep, component) {
    if (!dep.token) {
      return;
    }
    try {
      if (component && component.injector) {
        try {
          return component.injector.get(dep.token);
        } catch (ex) {
          return this.app.injector.get(dep.token);
        }
      } else {
        return this.app.injector.get(dep.token);
      }
    } catch (ex) {
      /* Ok to fail silently if we don't find it */
    }
  }

  // Takes a tree of components and turns it into a flat array
  private flattenComponentTree(tree: { component: any; children: any[] }) {
    return [tree.component].concat(...tree.children.map(cmp => this.flattenComponentTree(cmp)));
  }

  // Returns a tree of all components (angular or not) from a target point
  private drillForChildren(component: any): any {
    if (!(component instanceof DebugElement)) {
      // Change element to an angular element if possible
      component = this.ng.probe(component) ? this.ng.probe(component) : component;
    }
    if (!component.children || !component.children.length) {
      return { component, children: [] };
    }
    return {
      component,
      children: Array.from(component.children)
        .map(child => this.drillForChildren(child))
        .filter(Boolean)
    };
  }

  protected mapToDeveloperItem(item: any, type?: string): DeveloperItem {
    let constructor, instance, nativeElement;
    if (this.ng.isDebugElementComponent(item) && item.componentInstance) {
      constructor = item.componentInstance.constructor;
      instance = item.componentInstance;
      nativeElement = item.nativeElement;
    } else {
      constructor = item.constructor;
      instance = item;
    }
    if (this.devItemCache.has(item)) {
      const cached = this.devItemCache.get(item);
      this._cleanCache.set(item, cached);
      return cached;
    }
    const categoryConfig = this.getCategoryConfig(constructor);

    const devItem = {
      name: toTitle(constructor.name),
      instance,
      nativeElement,
      type,
      developerMethods: this.getMappedDeveloperFunctions(constructor).sort(
        this.sortByOptionalKey.bind(this, 'sort', 'label')
      ),
      ...categoryConfig,
      developerObservables: this.getDebugObservables(constructor).map(debugObs => ({
        ...debugObs
      }))
    };
    this._cleanCache.set(item, devItem);
    return devItem;
  }
}
