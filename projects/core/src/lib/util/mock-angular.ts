import { of } from 'rxjs';

const ZoneToken = 'zone';

export const MockAngularMethods = {
  getAllAngularRootElements: () => [
    {
      injector: {
        get: el =>
          el === ZoneToken
            ? {
                onStable: of([]),
                run: () => {}
              }
            : {}
      }
    }
  ],
  getAngularApplicationRoot: () => [],
  getAngularModuleInstance: () => [],
  isDebugElementComponent: () => [],
  resolveNgModuleDecoratorConfig: () => [],
  coreTokens: {
    NgZone: ZoneToken
  },
  probe: el => ({
    ...el,
    componentInstance: el
  })
};
