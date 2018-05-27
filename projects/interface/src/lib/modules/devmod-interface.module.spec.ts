import { TestBed } from '@angular/core/testing';
import { DevmodInterfaceModule } from './devmod-interface.module';

describe('DevmodInterface Module', () => {
  TestBed.configureTestingModule({
    imports: [DevmodInterfaceModule]
  });
  it('compiles and works', () => {
    TestBed.compileComponents();
  });
});
