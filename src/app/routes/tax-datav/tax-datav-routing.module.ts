import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxDatavNavComponent } from './nav/nav.component';

const routes: Routes = [

  { path: 'nav', component: TaxDatavNavComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxDatavRoutingModule { }
