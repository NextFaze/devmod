import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DevmodNoopModule } from './devmod-noop.module';

@Component({
  selector: 'devmod-test',
  template: '<devmod-toggle></devmod-toggle>'
})
class TestComponent {}

describe('DevmodNoop Module', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DevmodNoopModule],
      declarations: [TestComponent]
    });
  });

  it('compiles and works', () => {
    TestBed.compileComponents();
  });

  it('provides a noop component which removes itself from the dom', () => {
    const cmp = TestBed.createComponent(TestComponent);
    cmp.detectChanges();
    expect(cmp.nativeElement.querySelector('devmod-toggle')).toBeFalsy();
  });
});
