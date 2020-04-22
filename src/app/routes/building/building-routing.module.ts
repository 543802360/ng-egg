import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuildingModelComponent } from './model/model.component';

const routes: Routes = [

  { path: 'create', component: BuildingModelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingRoutingModule { }
