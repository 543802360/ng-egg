import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BigEnterpriseRoutingModule } from './big-enterprise-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BigEnterpriseRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BigEnterpriseModule { }
