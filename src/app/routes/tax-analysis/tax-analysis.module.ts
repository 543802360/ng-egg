import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TaxAnalysisRoutingModule } from './tax-analysis-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    TaxAnalysisRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TaxAnalysisModule { }
