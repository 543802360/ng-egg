import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvgTaxMapComponent } from './map/map.component';
import { AvgTaxOrderComponent } from './order/order.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'map',
        component: AvgTaxMapComponent,
        data: {
          title: '区域亩均税收分布'
        }
      },
      {
        path: 'order',
        component: AvgTaxOrderComponent,
        data: {
          title: '亩均税收排行'
        }
      },
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvgTaxRoutingModule { }
