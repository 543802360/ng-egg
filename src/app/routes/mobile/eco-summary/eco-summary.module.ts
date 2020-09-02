import { EcoSummaryCySummaryComponent } from './cy-summar/cy-summary.component';
import { NgModule } from '@angular/core';
import { EcoSummaryRoutingModule } from './eco-summary-routing.module';
import { SharedModule } from '@shared';
import { EcoSummaryHySummaryComponent } from './hy-summary/hy-summary.component';
import { EcoSummaryZsxmSummaryComponent } from './zsxm-summary/zsxm-summary.component';
import { EcoSummaryInvoiceSummaryComponent } from './invoice-summary/invoice-summary.component';
import { EcoSummaryAllSummaryComponent } from './all-summary/all-summary.component';
import { EcoSummaryComponent } from './eco-summary.component';

const COMPONENTS = [
  EcoSummaryCySummaryComponent,
  EcoSummaryComponent,
  EcoSummaryHySummaryComponent,
  EcoSummaryZsxmSummaryComponent,
  EcoSummaryInvoiceSummaryComponent,
  EcoSummaryAllSummaryComponent];
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
