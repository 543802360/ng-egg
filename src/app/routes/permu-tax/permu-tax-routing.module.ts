import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermuTaxDatavmapComponent } from './datavmap/datavmap.component';

const routes: Routes = [
  { path: 'datavmap', component: PermuTaxDatavmapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermuTaxRoutingModule { }
