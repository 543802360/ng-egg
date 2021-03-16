import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeductsumDetailsComponent } from './details/details.component';
import { DeductsumTaxRefundComponent } from './tax-refund/tax-refund.component';

const routes: Routes = [

  {
    path: 'details',
    data: {
      title: '税票明细'
    },
    component: DeductsumDetailsComponent
  },
  {
    path: 'tax-refund',
    data: {
      title: '退税明细'
    },
    component: DeductsumTaxRefundComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeductsumRoutingModule { }
