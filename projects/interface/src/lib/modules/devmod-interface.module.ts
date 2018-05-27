import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApplicationInformationService, DevmodCoreModule } from '@devmod/core';
import { AngularDraggableModule } from 'angular2-draggable';

import { DevmodListComponent } from '../components/devmod-list/devmod-list.component';
import { DevmodToggleComponent } from '../components/devmod-toggle/devmod-toggle.component';
import { BuiltinTools } from '../services/builtin-tools/builtin-tools.service';
import { DevmodModal } from '../util/consts';

@NgModule({
  imports: [DevmodCoreModule, CommonModule, PortalModule, AngularDraggableModule],
  declarations: [DevmodListComponent, DevmodToggleComponent],
  entryComponents: [DevmodListComponent],
  exports: [DevmodToggleComponent],
  providers: [
    BuiltinTools,
    ApplicationInformationService,
    {
      provide: DevmodModal,
      useValue: DevmodListComponent
    }
  ]
})
export class DevmodInterfaceModule {
  constructor() {
    console.log(`Use DevmodNoopModule in production to hide developer tools.`);
  }
}
