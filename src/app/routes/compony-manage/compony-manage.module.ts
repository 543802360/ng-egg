import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ComponyManageRoutingModule } from './compony-manage-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    ComponyManageRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ComponyManageModule { }
