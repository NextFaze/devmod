import { Component, NgModule } from '@angular/core';
import {
  isDebugElementComponent,
  getComponentName,
  resolveNgModuleDecoratorConfig
} from './angular';
import { TestBed } from '@angular/core/testing';

// tslint:disable-next-line
@Component({
  selector: 'devmod-test',
  template: 'test'
})
export class TestComponent {}

describe('Angular Utils', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent]
    });
    TestBed.compileComponents();
  });
  describe('isDebugElementComponent', () => {
    it('validates an angular component', () => {
      const comp = TestBed.createComponent(TestComponent);
      expect(isDebugElementComponent(comp.debugElement)).toEqual(true);
    });

    it('returns false for a non-angular component', () => {
      expect(isDebugElementComponent({})).toEqual(false);
    });
  });

  describe('getComponentName', () => {
    it('returns a component name for a debug element', () => {
      const comp = TestBed.createComponent(TestComponent);
      expect(getComponentName(comp.debugElement)).toEqual('TestComponent');
    });
    it('returns a component name for something that has a name on it', () => {
      const comp = {
        name: 'TestComponent2'
      };
      expect(getComponentName(comp)).toEqual('TestComponent2');
    });
  });

  describe('resolveNgModuleDecoratorConfig', () => {
    it('gets ngModule config from a module', () => {
      @NgModule({
        declarations: [TestComponent]
      })
      class Module {}
      expect(resolveNgModuleDecoratorConfig(Module).declarations).toEqual([TestComponent]);
    });
  });
});
