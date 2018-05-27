import { Injectable } from '@angular/core';
import { DeveloperCategory, DeveloperFunction } from '@devmod/core';
import { interval, timer } from 'rxjs';

@Injectable()
@DeveloperCategory({
  label: 'Developer Tools',
  hideOutline: true,
  padding: true,
  sort: -100
})
export class BuiltinTools {
  backdrop = true;
  opacity = 1;
  toggleVisible = true;

  constructor() {}

  @DeveloperFunction()
  closeTools() {}

  @DeveloperFunction({ autoclose: false })
  toggleBackdrop() {
    this.backdrop = !this.backdrop;
  }

  @DeveloperFunction({ autoclose: false })
  dimTools() {
    if (this.opacity < 1) {
      this.opacity = 1;
      this.backdrop = true;
    } else {
      this.opacity = 0.2;
      this.backdrop = false;
    }
  }

  @DeveloperFunction({ label: 'Show/Hide DevMod Toggle' })
  showHideToggle() {
    this.toggleVisible = !this.toggleVisible;
  }

  @DeveloperFunction()
  throwAnError() {
    throw new Error(`Error Manually Triggered From Devtools`);
  }

  @DeveloperFunction({
    autoclose: false
  })
  subscribeToSomethingTemporary() {
    timer(500).subscribe();
  }

  @DeveloperFunction({
    autoclose: false
  })
  subscribeToSomethingPermanent() {
    interval(500).subscribe();
  }
}
