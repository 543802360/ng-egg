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
      title: '大企业查询'
    }
  },
  {
    path: 'list',
    component: BigEnterpriseListComponent,
    data: {
      title: '大企业名录'
    }
  },
  {
    path: 'tax-analysis',
    component: BigEnterpriseTaxAnalysisComponent,
    data: {
      title: '大企业税收总体分析'
    }
  },
  {
    path: 'hy-analysis',
    component: BigEnterpriseHyAnalysisComponent,
    data: {
      title: '大企业行业分析'
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
