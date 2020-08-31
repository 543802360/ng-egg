import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcoSummaryHySummaryComponent } from './hy-summary/hy-summary.component';
import { EcoSummaryZsxmSummaryComponent } from './zsxm-summary/zsxm-summary.component';
import { EcoSummaryInvoiceSummaryComponent } from './invoice-summary/invoice-summary.component';
import { EcoSummaryAllSummaryComponent } from './all-summary/all-summary.component';

const routes: Routes = [

  {
    path: 'hy-summary',
    component: EcoSummaryHySummaryComponent
  },
  {
    path: 'zsxm-summary',
    component: EcoSummaryZsxmSummaryComponent
  },
  {
    path: 'invoice-summary',
    component: EcoSummaryInvoiceSummaryComponent
  },
  {
    path: 'all-summary',
    component: EcoSummaryAllSummaryComponent
  },
  {
    path: '',
    redirectTo: 'all-summary',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcoSummaryRoutingModule { }
