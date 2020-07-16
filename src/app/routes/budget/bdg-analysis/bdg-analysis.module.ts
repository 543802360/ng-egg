import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BdgAnalysisRoutingModule } from './bdg-analysis-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BdgAnalysisRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BdgAnalysisModule { }
