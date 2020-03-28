import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuildingEconomicCreateBuildingComponent } from './create-building/create-building.component';
import { BuildingEconomicBuildingListComponent } from './building-list/building-list.component';
import { BuildingEconomicBuildingMapComponent } from './building-map/building-map.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [

  {
    path: 'create',
    component: BuildingEconomicCreateBuildingComponent,
    canActivate: [ACLGuard],
    data: {
      title: '楼宇建模',
      guard: {
        ability: ['/building/create'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'list',
    component: BuildingEconomicBuildingListComponent,
    canActivate: [ACLGuard],
    data: {
      title: '楼宇数据维护',
      guard: {
        ability: ['/building/list'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'map',
    component: BuildingEconomicBuildingMapComponent,
    canActivate: [ACLGuard],
    data: {
      title: '楼宇经济地图',
      guard: {
        ability: ['/building/map'],
      },
      guard_url: 'exception/403'
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingEconomicRoutingModule { }
