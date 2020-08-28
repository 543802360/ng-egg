import { Component } from '@angular/core';
import { ToastService } from 'ng-zorro-antd-mobile';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  value = '';
  error = false;
  numberFocus = {
    focus: false,
    date: new Date()
  };
  inputFocus = {
    focus: false,
    date: new Date()
  };

  titleFocus = {
    focus: false,
    date: new Date()
  };
  autoFocus = { focus: true, date: new Date() };

  constructor(private _toast: ToastService) {}

  inputErrorClick(e) {
    this._toast.info('Please enter 11 digits');
  }

  inputChange(e) {
    const value = e.replace(/\s/g, '');
    if (value.length < 11 && value.length > 0) {
      this.error = true;
    } else {
      this.error = false;
    }
    this.value = e;
  }

  clickFocus() {
    this.numberFocus = {
      focus: true,
      date: new Date()
    };
  }

  clickFocusInput() {
    this.inputFocus = {
      focus: true,
      date: new Date()
    };
  }

  clickTitle() {
    this.titleFocus = {
      focus: true,
      date: new Date()
    };
  }
}
