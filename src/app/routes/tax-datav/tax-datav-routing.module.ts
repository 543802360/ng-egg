import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxDatavNavComponent } from './nav/nav.component';
import { TaxDatavSummaryComponent } from './summary/summary.component';
import { TaxDatavGsqyComponent } from './gsqy/gsqy.component';

const routes: Routes = [

  {
    path: 'nav',
    component: TaxDatavNavComponent,
    children: [
      {
        path: 'summary',
        component: TaxDatavSummaryComponent
      }, {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'nav',
    pathMatch: 'full'
  },
  { path: 'summary', component: TaxDatavSummaryComponent },
  { path: 'gsqy', component: TaxDatavGsqyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxDatavRoutingModule { }
