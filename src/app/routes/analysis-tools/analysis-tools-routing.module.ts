import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalysisToolsCompanyDimTaxComponent } from './company-dim-tax/company-dim-tax.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: 'company-dim-tax',
          component: AnalysisToolsCompanyDimTaxComponent
        },
        {
          path: '',
        }
      ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisToolsRoutingModule { }
