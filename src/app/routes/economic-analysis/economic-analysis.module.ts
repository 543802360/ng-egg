import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { EconomicAnalysisRoutingModule } from './economic-analysis-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DelonChartModule } from '@delon/chart';

const COMPONENTS = [DashboardComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    DelonChartModule,
    EconomicAnalysisRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class EconomicAnalysisModule { }
