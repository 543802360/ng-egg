import { OnboardingModule } from '@delon/abc';
import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { AnalysisToolsRoutingModule } from './analysis-tools-routing.module';
import { AnalysisToolsCompanyDimTaxComponent } from './company-dim-tax/company-dim-tax.component';
import { NgLeafletModule } from 'src/app/ng-leaflet/ng-leaflet.module';

const COMPONENTS: Type<void>[] = [
  AnalysisToolsCompanyDimTaxComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    OnboardingModule,
    NgLeafletModule,
    AnalysisToolsRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class AnalysisToolsModule { }
