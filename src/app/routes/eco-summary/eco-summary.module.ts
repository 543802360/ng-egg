import { NgModule } from '@angular/core';
import { EcoSummaryRoutingModule } from './eco-summary-routing.module';
import { SharedModule } from '../../shared/shared.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    EcoSummaryRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class EcoSummaryModule { }
