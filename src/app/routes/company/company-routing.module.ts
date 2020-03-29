import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyListComponent } from './list/list.component';
import { CompanyPositionComponent } from './position/position.component';
import { CompanyUsedNameComponent } from './used-name/used-name.component';

const routes: Routes = [

  { path: 'list', component: CompanyListComponent },
  { path: 'position', component: CompanyPositionComponent },
  { path: 'used-name', component: CompanyUsedNameComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
