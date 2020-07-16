import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BdgSettingRoutingModule } from './bdg-setting-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BdgSettingRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BdgSettingModule { }
