import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { BuildingEconomicListComponent } from './list/list.component';
import { BuildingEconomicMapComponent } from './map/map.component';
import { BuildingEconomicCompanyComponent } from './company/company.component';
import { BuildingEconomicCreateComponent } from './create/create.component';

const routes: Routes = [

  {
    path: 'create',
    component: BuildingEconomicCreateComponent ,
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
    component: BuildingEconomicListComponent,
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
    component:BuildingEconomicMapComponent ,
    data: {
      title: '楼宇经济地图',
      guard: {
        ability: ['/building/map'],
      },
      guard_url: 'exception/403'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingEconomicRoutingModule { }
