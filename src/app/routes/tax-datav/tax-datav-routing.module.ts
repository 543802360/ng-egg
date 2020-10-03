import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxDatavNavComponent } from './nav/nav.component';
import { TaxDatavSummaryComponent } from './summary/summary.component';

const routes: Routes = [

  {
    path: 'nav',
    component: TaxDatavNavComponent
  },
  {
    path: '',
    redirectTo: 'nav',
    pathMatch: 'full'
  },
  { path: 'summary', component: TaxDatavSummaryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxDatavRoutingModule { }
