import {
  AngularApplicationDebugger,
  ApplicationHandler,
  ApplicationInformationService,
  DebugObservable,
  DeveloperCategory,
  DeveloperFunction,
  DeveloperModule,
  DevmodCoreModule,
  enableDebugMode
} from './public_api';

describe('Public API', () => {
  it('exports all decorators', () => {
    expect(DebugObservable instanceof Function).toBe(true);
    expect(DeveloperCategory instanceof Function).toBe(true);
    expect(DeveloperFunction instanceof Function).toBe(true);
    expect(DeveloperModule instanceof Function).toBe(true);
  });

  it('exports the module', () => {
    expect(DevmodCoreModule instanceof Function).toBe(true);
  });

  it('exports the handler classes', () => {
    expect(AngularApplicationDebugger instanceof Function).toBe(true);
    expect(ApplicationHandler instanceof Function).toBe(true);
    expect(ApplicationInformationService instanceof Function).toBe(true);
  });

  it('exports the method of enabling the decorators', () => {
    expect(enableDebugMode instanceof Function).toBe(true);
  });
});
