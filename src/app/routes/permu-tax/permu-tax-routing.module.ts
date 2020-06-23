import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermuTaxPermDatavComponent } from './perm-datav/perm-datav.component';
import { PermuTaxPermMapComponent } from './perm-map/perm-map.component';

const routes: Routes = [
  {
    path: 'perm-datav',
    component: PermuTaxPermDatavComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'perm-datav'
  },
  { path: 'perm-map', component: PermuTaxPermMapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermuTaxRoutingModule { }
