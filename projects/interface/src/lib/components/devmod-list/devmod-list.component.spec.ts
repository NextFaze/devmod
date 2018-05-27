import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ApplicationInformationService } from '@devmod/core';
import { of } from 'rxjs';

import { BuiltinTools } from '../../services/builtin-tools/builtin-tools.service';
import { DevmodToggleComponent } from '../devmod-toggle/devmod-toggle.component';
import { DevmodListComponent } from './devmod-list.component';

const debugComponents = [
  {
    name: 'Debug Component',
    nativeElement: {},
    instance: {
      someMethod: () => {}
    },
    developerMethods: [
      {
        name: 'someMethod',
        label: 'Some Method'
      }
    ],
    type: 'component'
  }
];

const mockApp = {
  decoratedItems: of(debugComponents)
};
const mockBuiltin = {};
const mockToggle = {
  outlet: {
    detach: () => {}
  }
};

@Component({
  selector: 'devmod-test',
  styles: [
    `
  :host() {
    width: 50px;
    height: 40px;
    position: absolute;
    top: 10px;
    right: 10px;
    box-sizing: border-box;
  }
  `
  ],
  template: `Test`
})
class TestComponent {}

describe('devmod-list', () => {
  let list: ComponentFixture<DevmodListComponent>;
  let testCmp: ComponentFixture<TestComponent>;

  beforeEach(() => {
    spyOn(mockToggle.outlet, 'detach');
    spyOn(debugComponents[0].instance, 'someMethod');
    TestBed.configureTestingModule({
      imports: [CommonModule, BrowserModule],
      declarations: [DevmodListComponent, TestComponent],
      providers: [
        {
          provide: ApplicationInformationService,
          useValue: mockApp
        },
        {
          provide: BuiltinTools,
          useValue: mockBuiltin
        },
        {
          provide: DevmodToggleComponent,
          useValue: mockToggle
        }
      ]
    });
    TestBed.compileComponents();
    list = TestBed.createComponent(DevmodListComponent);
    testCmp = TestBed.createComponent(TestComponent);
  });

  it('allows setting background', () => {
    const instance = list.componentInstance;
    instance.builtin.backdrop = true;
    list.detectChanges();
    expect(list.debugElement.nativeElement.className).toEqual('hasBackground');
    instance.builtin.backdrop = false;
    list.detectChanges();
    expect(list.debugElement.nativeElement.className).toEqual('');
  });

  it('allows setting opacity', () => {
    const instance = list.componentInstance;
    instance.builtin.opacity = 0.5;
    list.detectChanges();
    expect(list.debugElement.nativeElement.style.opacity).toEqual('0.5');
  });

  it('allows setting can close itself as an overlay', () => {
    expect(mockToggle.outlet.detach).not.toHaveBeenCalled();
    list.detectChanges();
    list.componentInstance.close();
    expect(mockToggle.outlet.detach).toHaveBeenCalled();
  });

  it('can run a method on a component instance', () => {
    const component = {
      someDebugFunction: () => {}
    };
    spyOn(component, 'someDebugFunction');
    list.componentInstance.runMethod(
      component,
      { name: 'someDebugFunction', args: [[1, 2], 3] },
      {}
    );
    expect(component.someDebugFunction).toHaveBeenCalledWith([1, 2], 3);
  });

  it('can prompt for arguments if alt key is held', () => {
    const component = {
      someValue: 41,
      someDebugFunction: () => {}
    };
    spyOn(component, 'someDebugFunction');
    spyOn(window, 'prompt').and.returnValue('this.someValue + 1');
    list.componentInstance.runMethod(
      component,
      { name: 'someDebugFunction', args: 4 },
      {
        altKey: true
      }
    );
    expect(window.prompt).toHaveBeenCalledWith('Will evaluate (with component as `this`):', '4');
    expect(component.someDebugFunction).toHaveBeenCalledWith(42);
  });

  it('can highlight an arbitrary dom element', () => {
    list.componentInstance.highlight(testCmp);
    testCmp.detectChanges();
    const highlightbox: HTMLElement = document.querySelector('.devmod-highlight-element');
    expect(highlightbox).toBeTruthy();
    expect(highlightbox.style.position).toEqual('absolute');
    expect(highlightbox.style.left).toEqual(testCmp.nativeElement.getBoundingClientRect().x + 'px');
    expect(highlightbox.style.top).toEqual(testCmp.nativeElement.getBoundingClientRect().y + 'px');
    expect(highlightbox.style.width).toEqual('50px');
    expect(highlightbox.style.height).toEqual('40px');
    list.componentInstance.removeHighlight();
    testCmp.detectChanges();
    expect(document.querySelector('.devmod-highlight-element')).toBeFalsy();
  });

  it('removes any existing highlights when destroyed', () => {
    list.componentInstance.highlight(testCmp);
    testCmp.detectChanges();
    list.destroy();
    testCmp.detectChanges();
    expect(document.querySelector('.devmod-highlight-element')).toBeFalsy();
  });

  it('has an application statistics tab', () => {
    list.componentInstance.debug = true;
    list.componentInstance.activeComponent = {};
    list.detectChanges();
    const tabs: HTMLElement[] = list.nativeElement.querySelectorAll('button');
    const tab: HTMLElement = Array.from(tabs).find(t => t.textContent === 'App Stats');
    tab.click();
    list.detectChanges();
    expect(list.componentInstance.activeComponent).toBeFalsy();
    const activeHeader = list.nativeElement.querySelector('h3');
    expect(activeHeader.textContent).toEqual('Application Statistics');
  });

  it('has tabs for each debug component', () => {
    list.componentInstance.debug = true;
    list.detectChanges();

    const tabs: HTMLElement[] = list.nativeElement.querySelectorAll('button');
    expect(tabs.length).toEqual(2);
    const tab = Array.from(tabs).find(t => t.textContent === 'Debug Component');
    expect(tab).toBeTruthy();
  });

  it('has a button for each debug method on a component', () => {
    list.detectChanges();
    const tabs: HTMLElement[] = list.nativeElement.querySelectorAll('button');
    const tab = Array.from(tabs).find(t => t.textContent === 'Debug Component');

    tab.click();
    list.detectChanges();

    expect(debugComponents[0].instance.someMethod).not.toHaveBeenCalled();
    const methods = list.nativeElement.querySelectorAll('.dm-main .item.item-method');
    expect(methods[0].textContent.trim()).toEqual('Outline Component');
    expect(methods[1].textContent.trim()).toEqual('Some Method');
    methods[1].click();
    list.detectChanges();
    expect(debugComponents[0].instance.someMethod).toHaveBeenCalled();
  });

  // Observable list tests skipped - it should be moved to a pluggable module at a later date.
});
