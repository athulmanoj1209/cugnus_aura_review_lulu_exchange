import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
  standalone: true
})
export class UppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    const upper = initialValue.toUpperCase();
    if (initialValue !== upper) {
      this.el.nativeElement.value = upper;
      event.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
