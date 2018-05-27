import { CommonModule } from '@angular/common';
import { TestabilityRegistry } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

import { AngularMethods } from '../public_api';
import { DevmodCoreModule } from './devmod-core.module';
import { ApplicationInformationService } from './services/application-information.service';
import { MockAngularMethods } from './util/mock-angular';

describe('DevmodModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BrowserModule,
        TestabilityRegistry,
        CommonModule,
        {
          provide: AngularMethods,
          useValue: MockAngularMethods
        }
      ],
      imports: [DevmodCoreModule]
    });
  });

  it('Provides an application information service', () => {
    const svc = TestBed.get(ApplicationInformationService);
    expect(svc instanceof ApplicationInformationService).toBe(true);
  });
});
