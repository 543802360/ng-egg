import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobileMapJdxzMapComponent } from './jdxz-map/jdxz-map.component';
import { MobileMapDotMapComponent } from './dot-map/dot-map.component';

const routes: Routes = [

  {
    path: 'jdxz-map',
    component: MobileMapJdxzMapComponent
  },
  {
    path: 'dot-map',
    component: MobileMapDotMapComponent
  }, {
    path: '',
    redirectTo: 'jdxz-map',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileMapRoutingModule { }
