import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxAnalysisOrderComponent } from './order/order.component';
import { TaxAnalysisSingleComponent } from './single/single.component';
import { TaxAnalysisBatchComponent } from './batch/batch.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [ACLGuard],
    children: [
      {
        path: 'order',
        component: TaxAnalysisOrderComponent,
        data: {
          title: '税收排名',
          guard: {
            ability: ['/analysis/order'],
          },
          guard_url: 'exception/403'
        }
      },
      {
        path: 'single',
        component: TaxAnalysisSingleComponent,
        data: {
          title: '税收查询',
          guard: {
            ability: ['/analysis/single'],
          },
          guard_url: 'exception/403'
        }
      },
      {
        path: 'batch',
        component: TaxAnalysisBatchComponent,
        data: {
          title: '批量查询',
          guard: {
            ability: ['/analysis/batch'],
          },
          guard_url: 'exception/403'
        }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'order'
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxAnalysisRoutingModule { }
