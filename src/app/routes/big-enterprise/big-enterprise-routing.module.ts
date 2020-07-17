import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BigEnterpriseListComponent } from './list/list.component';
import { BigEnterpriseTaxAnalysisComponent } from './tax-analysis/tax-analysis.component';
import { BigEnterpriseHyAnalysisComponent } from './hy-analysis/hy-analysis.component';

const routes: Routes = [

  { path: 'list', component: BigEnterpriseListComponent },
  { path: 'tax-analysis', component: BigEnterpriseTaxAnalysisComponent },
  { path: 'hy-analysis', component: BigEnterpriseHyAnalysisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BigEnterpriseRoutingModule { }
