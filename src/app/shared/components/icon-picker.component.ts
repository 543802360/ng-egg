import {
  Component,
  Input,
  Output
} from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-IconPicker',
  template: `<input [iconPicker]="icon" (iconPickerSelect)="onIconPickerSelect($event)"/>`,
})
export class IconPickerComponent {
  @Input() position: string;
  @Input() onIconPickerSelect;
  icon: string;

  constructor() { }
}
