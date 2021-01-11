import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcoSummaryHySummaryComponent } from './hy-summary/hy-summary.component';
import { EcoSummaryZsxmSummaryComponent } from './zsxm-summary/zsxm-summary.component';
import { EcoSummaryInvoiceSummaryComponent } from './invoice-summary/invoice-summary.component';
import { EcoSummaryAllSummaryComponent } from './all-summary/all-summary.component';
import { EcoSummaryComponent } from './eco-summary.component';
import { EcoSummaryCySummaryComponent } from './cy-summar/cy-summary.component';

const routes: Routes = [

  {
    path: '',
    component: EcoSummaryComponent,
    children: [
      {
        path: 'hy-summary',
        component: EcoSummaryHySummaryComponent,
        data: {
          title: '行业分析'
        }
      },
      {
        path: 'cy-summary',
        component: EcoSummaryCySummaryComponent,
        data: {
          title: '产业分析'
        }
      },
      {
        path: 'zsxm-summary',
        component: EcoSummaryZsxmSummaryComponent,
        data: {
          title: '分税种分析'
        }
      },
      {
        path: 'invoice-summary',
        component: EcoSummaryInvoiceSummaryComponent,
        data: {
          title: '开票分析'
        }
      },
      {
        path: 'hy-summary',
        component: EcoSummaryAllSummaryComponent,
        data: {
          title: '财政总收入分析'
        }
      },
      {
        path: '',
        redirectTo: 'zsxm-summary',
        pathMatch: 'full'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcoSummaryRoutingModule { }
