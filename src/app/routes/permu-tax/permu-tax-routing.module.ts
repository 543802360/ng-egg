import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermuTaxPermDatavComponent } from './perm-datav/perm-datav.component';

const routes: Routes = [
  {
    path: 'perm-datav',
    component: PermuTaxPermDatavComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'perm-datav'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermuTaxRoutingModule { }
