import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { MobileDrawerConditionComponent } from './components/drawer-condition/drawer-condition.component';

const COMPONENTS: Type<void>[] =
  [
    MobileDrawerConditionComponent
  ];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdMobileModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  exports: [COMPONENTS]
})
export class MobileSharedModule { }
