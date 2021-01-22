import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterpriseGroupOrderComponent } from './order/order.component';
import { EnterpriseGroupDetailComponent } from './detail/detail.component';
import { EnterpriseGroupMapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'order',
        component: EnterpriseGroupOrderComponent
      },
      {
        path: 'detail',
        component: EnterpriseGroupDetailComponent
      },
      {
        path: 'map',
        component: EnterpriseGroupMapComponent
      },
      {
        path: '',
        redirectTo: 'order',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterpriseGroupRoutingModule { }
