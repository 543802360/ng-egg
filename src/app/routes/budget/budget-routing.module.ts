import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetBdgSettingBdgCountyComponent } from './bdg-setting/bdg-county/bdg-county.component';
import { BudgetBdgSettingBdgTownComponent } from './bdg-setting/bdg-town/bdg-town.component';
import { BudgetBdgAnalysisCompanyOrderComponent } from './bdg-analysis/company-order/company-order.component';
import { BudgetBdgAnalysisBatchQueryComponent } from './bdg-analysis/batch-query/batch-query.component';
import { BudgetBdgAnalysisSingleQueryComponent } from './bdg-analysis/single-query/single-query.component';

const routes: Routes = [
  {
    path: 'company',
    loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
  },
  {
    path: 'bdg-county',
    component: BudgetBdgSettingBdgCountyComponent,
    data: {
      title: '区年度预算目标',
      guard: {
        ability: ['/budget/bdg-county'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'bdg-town',
    component: BudgetBdgSettingBdgTownComponent,
    data: {
      title: '街道年度预算目标',
      guard: {
        ability: ['/budget/bdg-town'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'company-order',
    component: BudgetBdgAnalysisCompanyOrderComponent,
    data: {
      title: '企业税收排名',
      guard: {
        ability: ['/budget/company-order'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'batch-query',
    component: BudgetBdgAnalysisBatchQueryComponent,
    data: {
      title: '批量税收查询',
      guard: {
        ability: ['/budget/batch-query'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'single-query',
    component: BudgetBdgAnalysisSingleQueryComponent,
    data: {
      title: '企业税收明细查询',
      guard: {
        ability: ['/budget/single-query'],
      },
      guard_url: 'exception/403'
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
