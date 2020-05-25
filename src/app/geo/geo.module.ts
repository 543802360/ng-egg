import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
const THIRDMODULES = [
  NgZorroAntdModule];
// #endregion

// #region your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  entryComponents: [],
  exports: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})
export class GeoModule { }
