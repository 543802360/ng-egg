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
      title: '区年度预算目标设置'
    }
  },
  {
    path: 'bdg-town',
    component: BudgetBdgSettingBdgTownComponent,
    data: {
      title: '镇街年度预算目标设置'
    }
  },
  {
    path: 'company-order',
    component: BudgetBdgAnalysisCompanyOrderComponent,
    data: {
      title: '企业税收排名'
    }
  },
  {
    path: 'batch-query',
    component: BudgetBdgAnalysisBatchQueryComponent,
    data: {
      title: '批量税收查询'
    }
  },
  {
    path: 'single-query',
    component: BudgetBdgAnalysisSingleQueryComponent,
    data: {
      title: '企业税收明细查询'
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
