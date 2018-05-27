import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

import {
  AngularApplicationDebugger,
  AngularMethods
} from '../application-handlers/angular-application-handler';
import { DeveloperItem } from '../application-handlers/application-handler';
import { patches } from '../util/patches';

@Injectable()
export class ApplicationInformationService {
  app: AngularApplicationDebugger;
  get activeSubscriptions() {
    return patches.subscriptions;
  }

  _devItems = new BehaviorSubject<DeveloperItem[]>([]);

  constructor(public ng: AngularMethods) {
    this.app = new AngularApplicationDebugger(
      this.ng.probe(this.ng.getAllAngularRootElements()[0]),
      [ApplicationInformationService],
      this.ng
    );
    this.app.decoratedItems.subscribe(items => {
      this.app.zone.run(() => {
        this._devItems.next(items);
      });
    });
  }

  get decoratedItems(): Observable<DeveloperItem[]> {
    return this._devItems;
  }
}
