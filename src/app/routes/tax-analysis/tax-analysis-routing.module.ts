import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxAnalysisOrderComponent } from './order/order.component';
import { TaxAnalysisSingleComponent } from './single/single.component';
import { TaxAnalysisBatchComponent } from './batch/batch.component';

const routes: Routes = [

  { path: 'order', component: TaxAnalysisOrderComponent },
  { path: 'single', component: TaxAnalysisSingleComponent },
  { path: 'batch', component: TaxAnalysisBatchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxAnalysisRoutingModule { }
