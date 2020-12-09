import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.el.nativeElement.value='';
    this.el.nativeElement.focus();
    
  }

}
