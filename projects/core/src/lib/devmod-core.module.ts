import { AngularMethods } from './application-handlers/angular-application-handler';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ApplicationInformationService } from './services/application-information.service';
import {
  getAngularApplicationRoot,
  getAngularModuleInstance,
  isDebugElementComponent,
  resolveNgModuleDecoratorConfig
} from './util/angular';

const globalScope: any = (() => {
  try {
    return window;
  } catch (ex) {
    // NativeScript or some other non-browser environment
    return global;
  }
})();

export function factory() {
  // Lazy load these in a factory so that angular has a chance to bootstrap
  return {
    getAllAngularRootElements: globalScope.getAllAngularRootElements,
    getAngularApplicationRoot: getAngularApplicationRoot,
    getAngularModuleInstance: getAngularModuleInstance,
    isDebugElementComponent: isDebugElementComponent,
    resolveNgModuleDecoratorConfig: resolveNgModuleDecoratorConfig,
    coreTokens: globalScope.ng && globalScope.ng.coreTokens,
    probe: globalScope.ng && globalScope.ng.probe
  };
}

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  providers: [
    ApplicationInformationService,
    {
      provide: AngularMethods,
      useFactory: factory
    }
  ]
})
export class DevmodCoreModule {
  constructor() {
    console.log(`If you see this message in production you should check the devmod README.`);
  }
}
