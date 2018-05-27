import { Injectable, NgModule } from '@angular/core';
import { of } from 'rxjs';

import { resolveNgModuleDecoratorConfig } from '../util/angular';
import { AngularApplicationDebugger } from './angular-application-handler';

describe('Angular Application Handler', () => {
  const injector = {
    get: token =>
      token === 'NgZone'
        ? {
            onStable: of(true)
          }
        : token
  };
  const app = { injector };
  const ng = {
    getAllAngularRootElements: () => [app],
    getAngularApplicationRoot: () => {},
    getAngularModuleInstance: () => {},
    getAngularModuleClass: () => {},
    isDebugElementComponent: () => {},
    resolveNgModuleDecoratorConfig,
    coreTokens: {
      NgZone: 'NgZone'
    },
    probe: () => {}
  };
  const handler = new AngularApplicationDebugger(app, [], ng);

  it('sets up decorated item observable on construction', done => {
    spyOn(app.injector, 'get').and.returnValue({
      onStable: of([])
    });
    spyOn(handler, 'probeForItemsWithDeveloperFunctions').and.returnValue([42]);
    spyOn(handler, 'allItemsMatch').and.returnValue(false);
    handler.decoratedItems.subscribe(items => {
      expect(<any>items).toEqual([42]);
      done();
    });
  });

  it('can probe for providers in the application', () => {
    @Injectable()
    class SomeInjectable {}
    @NgModule({
      providers: [SomeInjectable]
    })
    class App {}
    spyOn(ng, 'getAngularModuleInstance').and.returnValue({
      constructor: App
    });

    expect(handler.probeForProviders()).toEqual([SomeInjectable]);
  });

  it('can flatten a nested array', () => {
    expect(handler.flatten([[], [[{ item: 'something' }]], [[{ something: 'else' }]]])).toEqual([
      { item: 'something' },
      { something: 'else' }
    ]);
  });

  it('can map a provider class to an angular style provider', () => {
    class SomeInjectable {}
    expect(handler.mapToProvider(SomeInjectable)).toEqual({
      provide: SomeInjectable,
      useClass: SomeInjectable
    });

    expect(
      handler.mapToProvider({
        provide: SomeInjectable,
        useValue: 4
      })
    ).toEqual({
      provide: SomeInjectable,
      useValue: 4
    });
  });
});
