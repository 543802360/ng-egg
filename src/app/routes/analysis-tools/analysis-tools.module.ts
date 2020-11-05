import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { AnalysisToolsRoutingModule } from './analysis-tools-routing.module';
import { AnalysisToolsCompanyDimTaxComponent } from './company-dim-tax/company-dim-tax.component';

const COMPONENTS: Type<void>[] = [
  AnalysisToolsCompanyDimTaxComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    AnalysisToolsRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class AnalysisToolsModule { }
