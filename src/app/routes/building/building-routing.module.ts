import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuildingModelComponent } from './model/model.component';
import { BuildingListComponent } from './list/list.component';
import { BuildingMapComponent } from './map/map.component';

const routes: Routes = [

  { path: 'create', component: BuildingModelComponent },
  { path: 'list', component: BuildingListComponent },
  { path: 'map', component: BuildingMapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingRoutingModule { }
