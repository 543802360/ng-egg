import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { EcoMapRoutingModule } from './eco-map-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    EcoMapRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class EcoMapModule { }
