import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TaxAnalysisRoutingModule } from './tax-analysis-routing.module';
import { DelonChartModule } from '@delon/chart';
import { DashboardComponent } from './dashboard/dashboard.component';

const COMPONENTS = [

  DashboardComponent];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    DelonChartModule,
    TaxAnalysisRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TaxAnalysisModule { }
