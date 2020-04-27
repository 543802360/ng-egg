import { Component, OnInit, EventEmitter } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
  selector: 'sf-fontawesome',
  template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
   <input
      [iconPicker]="icon"
      (iconPickerSelect)="onIconPickerSelect($event)"
      [ipPosition]="position"
      [ipPlaceHolder] ="placeHolder"
      [ipHeight] ="height"
   />

    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`
})
// tslint:disable-next-line: component-class-suffix
export class FontAwesomeWidget extends ControlWidget implements OnInit {
  // TODO: add explicit constructor

  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'fontawesome';

  // 组件所需要的参数，建议使用 `ngOnInit` 获取
  icon: any;
  onIconPickerSelect: any;
  prefix: string;
  position: string;
  placeHolder: string;
  width: any;
  height: any;
  maxHeight: any;
  ngOnInit(): void {
    this.onIconPickerSelect = this.ui.onIconPickerSelect;
    this.prefix = this.ui.prefix ? this.ui.prefix : 'fa';
    this.position = this.ui.position ? this.ui.position : 'bottom';
    this.width = this.ui.width ? `${this.ui.width}px` : '230px';
    this.height = this.ui.height ? `${this.ui.height}px` : 'auto';
    this.placeHolder = this.ui.placeHolder ? this.ui.placeHolder : '请选择图标';
  }

  // reset 可以更好的解决表单重置过程中所需要的新数据问题
  reset(value: string) {

  }

  change(value: string) {
    if (this.ui.change) this.ui.change(value);
    this.setValue(value);
    this.icon = value;
  }
}

