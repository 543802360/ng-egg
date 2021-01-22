import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermuTaxPermDatavComponent } from './perm-datav/perm-datav.component';
import { PermuTaxPermHyComponent } from './perm-hy/perm-hy.component';
import { PermuTaxPermOrderComponent } from './perm-order/perm-order.component';
import { PermuTaxPermMapComponent } from './perm-map/perm-map.component';
import { PermuTaxPermRiskComponent } from './perm-risk/perm-risk.component';

const routes: Routes = [
  {
    path: 'perm-datav',
    component: PermuTaxPermDatavComponent
  },
  { path: 'perm-hy', component: PermuTaxPermHyComponent },
  { path: 'perm-order', component: PermuTaxPermOrderComponent },
  { path: 'perm-map', component: PermuTaxPermMapComponent },
  { path: 'perm-risk', component: PermuTaxPermRiskComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermuTaxRoutingModule { }
