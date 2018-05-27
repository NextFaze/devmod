import { Component, ElementRef, NgModule } from '@angular/core';

@Component({
  selector: 'devmod-toggle,[ngDraggable]',
  template: ''
})
export class NoopComponent {
  constructor(element: ElementRef) {
    this.applyPolyfill();
    element.nativeElement.remove();
  }

  applyPolyfill() {
    // IE 9+ Polyfill for element removal
    // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
    // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
    (function(arr) {
      arr.forEach(function(item) {
        if (item.hasOwnProperty('remove')) {
          return;
        }
        Object.defineProperty(item, 'remove', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function remove() {
            if (this.parentNode !== null) {
              this.parentNode.removeChild(this);
            }
          }
        });
      });
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
  }
}

@NgModule({
  imports: [],
  declarations: [NoopComponent],
  exports: [NoopComponent]
})
export class DevmodNoopModule {}
