import { CdkPortalOutlet, ComponentPortal, PortalOutlet } from '@angular/cdk/portal';
import {
  Component,
  HostBinding,
  Inject,
  Input,
  ViewChild,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { isDebugMode } from '@devmod/core';

import { BuiltinTools } from '../../services/builtin-tools/builtin-tools.service';
import { DevmodModal } from '../../util/consts';

const TILDE = 192;

@Component({
  selector: 'devmod-toggle',
  templateUrl: './devmod-toggle.component.html',
  styleUrls: ['./devmod-toggle.component.scss']
})
export class DevmodToggleComponent implements OnInit {
  public debug = isDebugMode();

  private _left: string;
  private _top: string;
  private _right = '0.5rem';
  private _bottom = '10rem';

  private startPosition: ClientRect;
  private preventBootstrap = false;
  private portal: ComponentPortal<any>;

  private codePoints = [129304, 128526, 128293, 128076, 128175];
  private codePoint = this.codePoints[Math.floor(Math.random() * this.codePoints.length)];

  @ViewChild(CdkPortalOutlet) outlet: PortalOutlet;

  @Input() dragTolerance = 4;
  @Input() enableHotkey = true;
  @Input() disableMessage = false;

  @Input()
  @HostBinding('style.left')
  set left(value: string) {
    this._right = undefined;
    this._left = value;
  }

  @Input()
  @HostBinding('style.right')
  set right(value: string) {
    this._left = undefined;
    this._right = value;
  }

  @Input()
  @HostBinding('style.top')
  set top(value: string) {
    this._bottom = undefined;
    this._top = value;
  }

  @Input()
  @HostBinding('style.bottom')
  set bottom(value: string) {
    this._top = undefined;
    this._bottom = value;
  }

  @HostBinding('style.display')
  get display() {
    return this.builtin.toggleVisible;
  }

  get left() {
    return this._left;
  }
  get right() {
    return this._right;
  }
  get top() {
    return this._top;
  }
  get bottom() {
    return this._bottom;
  }

  get showToggle() {
    return this.builtin.toggleVisible;
  }

  constructor(
    public view: ViewContainerRef,
    @Inject(DevmodModal) public modalClass,
    public builtin: BuiltinTools
  ) {}

  toggleClicked() {
    if (this.isOpen) {
      this.preventBootstrap = false;
      this.close();
      return;
    }
    if (this.preventBootstrap) {
      return (this.preventBootstrap = false);
    }
    this.open();
  }

  get isOpen() {
    return this.portal && this.portal.isAttached;
  }

  emoji() {
    return String.fromCodePoint(this.codePoint);
  }

  ngOnInit() {
    if (!this.debug) {
      return;
    }

    if (!this.disableMessage) {
      console.log(
        `
        %c${this.emoji()} NextFaze DevMod Developer Interface Enabled ${this.emoji()}`,
        'color: tomato; font-size: 12px;',
        ''
      );
      console.log(`
      Click the </> or press \` to toggle developer interface`);
    }

    if (this.enableHotkey) {
      window.addEventListener('keyup', e => {
        const target = e.target;
        const nodeName = ((target && (<any>target).nodeName) || '').toLowerCase();
        if (e.keyCode === TILDE && !nodeName.includes('input')) {
          this.toggleClicked();
        }
      });
    }
  }

  open() {
    this.portal = new ComponentPortal(this.modalClass);
    this.portal.attach(this.outlet);
  }

  close() {
    if (this.isOpen) {
      this.outlet.detach();
    }
  }

  onDragStart(element: HTMLElement) {
    this.startPosition = element.getBoundingClientRect();
  }

  onDragEnd(element: HTMLElement) {
    const end = element.getBoundingClientRect();
    const deltaX = Math.abs(this.startPosition.left - end.left);
    const deltaY = Math.abs(this.startPosition.top - end.top);
    if (deltaX + deltaY > this.dragTolerance) {
      this.preventBootstrap = true;
    }
  }
}
