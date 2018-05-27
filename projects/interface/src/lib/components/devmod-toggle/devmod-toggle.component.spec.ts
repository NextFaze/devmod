import { PortalModule } from '@angular/cdk/portal';
import { Component, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuiltinTools } from '../../services/builtin-tools/builtin-tools.service';
import { DevmodModal } from '../../util/consts';
import { DevmodToggleComponent } from './devmod-toggle.component';

@Component({
  selector: 'devmod-test-modal',
  template: `<div class="test-modal"></div>`
})
class TestModalComponent {}

@NgModule({
  declarations: [TestModalComponent],
  entryComponents: [TestModalComponent]
})
class ModalModule {}

const builtin = {
  visible: true,
  get toggleVisible() {
    return this.visible;
  }
};

describe('devmod-toggle', () => {
  let comp: ComponentFixture<DevmodToggleComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PortalModule, ModalModule],
      declarations: [DevmodToggleComponent],
      providers: [
        {
          provide: DevmodModal,
          useValue: TestModalComponent
        },
        {
          provide: BuiltinTools,
          useValue: builtin
        }
      ]
    });

    TestBed.compileComponents();
    comp = TestBed.createComponent(DevmodToggleComponent);
    comp.componentInstance.debug = true;
    comp.detectChanges();
  });

  it('renders a button', () => {
    expect(comp.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('does not render a button in debug mode', () => {
    comp.componentInstance.debug = false;
    comp.detectChanges();
    expect(comp.nativeElement.querySelector('button')).toBeFalsy();
  });

  it('supports customizing the initial start position of the button', () => {
    comp.componentInstance.top = '100px';
    comp.componentInstance.left = '40px';
    comp.detectChanges();
    expect(comp.nativeElement.getBoundingClientRect().x).toEqual(40);
    expect(comp.nativeElement.getBoundingClientRect().y).toEqual(100);
  });

  it('resets the opposite bounds when setting custom position', () => {
    comp.componentInstance.right = '40px';
    comp.componentInstance.bottom = '40px';
    expect(comp.componentInstance.left).toEqual(undefined);
    expect(comp.componentInstance.top).toEqual(undefined);

    comp.componentInstance.left = '40px';
    comp.componentInstance.top = '40px';
    expect(comp.componentInstance.right).toEqual(undefined);
    expect(comp.componentInstance.bottom).toEqual(undefined);
  });

  it('can have its visibility toggled', () => {
    comp.detectChanges();
    const button = comp.nativeElement.querySelector('button');
    const style = getComputedStyle(button);
    spyOnProperty(comp.componentInstance, 'showToggle').and.returnValue(false);
    comp.detectChanges();
    expect(style.display).toEqual('none');
  });

  it('can show a modal', () => {
    comp.detectChanges();
    expect(comp.nativeElement.querySelector('devmod-test-modal')).toBeFalsy();
    comp.componentInstance.toggleClicked();
    comp.detectChanges();
    expect(comp.nativeElement.querySelector('devmod-test-modal')).toBeTruthy();
  });

  it('can remove the modal', () => {
    comp.componentInstance.toggleClicked();
    comp.detectChanges();
    comp.componentInstance.toggleClicked();
    comp.detectChanges();
    expect(Array.from(comp.nativeElement.querySelectorAll('devmod-test-modal')).length).toEqual(0);
  });
});
