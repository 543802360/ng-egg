import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcoMapDotMapComponent } from './dot-map/dot-map.component';
import { EcoMapAggMapComponent } from './agg-map/agg-map.component';
import { EcoMapComponent } from './eco-map.component';

const routes: Routes = [
  {
    path: '',
    component: EcoMapComponent,
    children: [
      {
        path: 'dot-map',
        component: EcoMapDotMapComponent,
      },
      {
        path: 'agg-map',
        component: EcoMapAggMapComponent
      },
      {
        path: '',
        redirectTo: 'dot-map',
        pathMatch: 'full'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcoMapRoutingModule { }
