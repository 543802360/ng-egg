import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyListComponent } from './list/list.component';
import { CompanyPositionComponent } from './position/position.component';

const routes: Routes = [

  { path: 'list', component: CompanyListComponent },
  { path: 'position', component: CompanyPositionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
