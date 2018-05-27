import {
  BuiltinTools,
  DevmodInterfaceModule,
  DevmodModal,
  DevmodNoopModule,
  DevmodListComponent,
  DevmodToggleComponent
} from './public_api';

describe('Public API', () => {
  it('exports the main interface module', () => {
    expect(DevmodInterfaceModule).toBeTruthy();
  });

  it('exports the noop production module', () => {
    expect(DevmodNoopModule).toBeTruthy();
  });

  it('exports the list component', () => {
    expect(DevmodListComponent).toBeTruthy();
  });

  it('exports the toggle component', () => {
    expect(DevmodToggleComponent).toBeTruthy();
  });

  it('exports the builtin tools service for overriding', () => {
    expect(BuiltinTools).toBeTruthy();
  });

  it('exports the interfac to support overriding', () => {
    expect(DevmodModal).toBeTruthy();
  });
});
