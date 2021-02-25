import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BigEnterpriseListComponent } from './list/list.component';
import { BigEnterpriseTaxAnalysisComponent } from './tax-analysis/tax-analysis.component';
import { BigEnterpriseHyAnalysisComponent } from './hy-analysis/hy-analysis.component';
import { BigEnterpriseCreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path: 'create',
    component: BigEnterpriseCreateComponent,
    data: {
      title: '重点企业查询'
    }
  },
  {
    path: 'list',
    component: BigEnterpriseListComponent,
    data: {
      title: '重点企业名录'
    }
  },
  {
    path: 'tax-analysis',
    component: BigEnterpriseTaxAnalysisComponent,
    data: {
      title: '重点企业实时税收'
    }
  },
  {
    path: 'hy-analysis',
    component: BigEnterpriseHyAnalysisComponent,
    data: {
      title: '重点企业按行业分析'
    }
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BigEnterpriseRoutingModule { }
