import {
  Component,
  forwardRef,
  HostBinding,
  Inject,
  NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ApplicationInformationService, isDebugMode } from '@devmod/core';
import { Observable } from 'rxjs';

import { BuiltinTools } from '../../services/builtin-tools/builtin-tools.service';
import { DevmodToggleComponent } from '../devmod-toggle/devmod-toggle.component';

@Component({
  selector: 'devmod-list',
  templateUrl: './devmod-list.component.html',
  styleUrls: ['./devmod-list.component.scss']
})
export class DevmodListComponent implements OnInit, OnDestroy {
  _prev: any[] = [];
  showObs = {};
  components: Observable<any>;
  highlightElement: any;
  activeComponent: any;
  debug = isDebugMode();

  @HostBinding('class.hasBackground')
  get hasBackground() {
    return this.builtin.backdrop;
  }

  @HostBinding('style.opacity')
  get opacity() {
    return this.builtin.opacity;
  }

  get highlighted() {
    return !!this.highlightElement;
  }

  constructor(
    public application: ApplicationInformationService,
    public zone: NgZone,
    public builtin: BuiltinTools,
    @Inject(forwardRef(() => DevmodToggleComponent))
    private toggle: DevmodToggleComponent
  ) {}

  close() {
    this.removeHighlight();
    this.toggle.outlet.detach();
  }

  ngOnInit() {
    this.components = this.application.decoratedItems;
  }

  ngOnDestroy() {
    this.removeHighlight();
  }

  setActive(component?: any) {
    this.activeComponent = component;
  }

  runMethod(componentInstance, method, event) {
    let toEval = method.args;
    if (event.altKey) {
      if (typeof toEval !== 'string') {
        toEval = JSON.stringify(toEval);
      }
      toEval = prompt('Will evaluate (with component as `this`):', toEval);
      if (toEval === null) {
        // cancel
        return;
      }
    }
    const args = (() => eval(toEval)).call(componentInstance); // tslint:disable-line:no-eval
    if (Array.isArray(args)) {
      componentInstance[method.name](...args);
    } else {
      componentInstance[method.name](args);
    }
    if (method.autoclose !== false) {
      this.close();
    }
  }

  removeHighlight() {
    if (this.highlighted) {
      this.highlightElement.remove();
      this.highlightElement = null;
    }
  }

  // From Auguary
  highlight(component) {
    let node;
    if (component && component.nativeElement) {
      node = component.nativeElement;
    }
    if (!node) {
      return;
    }
    if (this.highlighted) {
      return this.removeHighlight();
    }
    const offsets = n => {
      const vals = {
        x: n.offsetLeft,
        y: n.offsetTop,
        w: n.offsetWidth,
        h: n.offsetHeight
      };
      while ((n = n.offsetParent)) {
        vals.x += n.offsetLeft;
        vals.y += n.offsetTop;
      }
      return vals;
    };
    const overlay = document.createElement('div');
    overlay.className = 'devmod-highlight-element';
    overlay.setAttribute(
      'style',
      `
      padding: 5px;
      font-size: 11px;
      line-height: 11px;
      position: absolute;
      text-align: right;
      z-index: 9999999999999 !important;
      pointer-events: none !important;
      min-height: 5px;
      background: rgba(126, 183, 253, 0.3);
      border: 1px solid rgba(126, 183, 253, 0.7) !important;
      color: #6da9d7 !important;
    `
    );
    const pos = offsets(node);
    overlay.style.left = `${pos.x}px`;
    overlay.style.top = `${pos.y}px`;
    overlay.style.width = `${pos.w}px`;
    overlay.style.height = `${pos.h}px`;
    document.body.appendChild(overlay);
    this.highlightElement = overlay;
  }
}
