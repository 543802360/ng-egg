import { EcoMapComponent } from './eco-map.component';
import { SharedModule } from '@shared';
import { NgModule } from '@angular/core';
import { EcoMapRoutingModule } from './eco-map-routing.module';
import { EcoMapDotMapComponent } from './dot-map/dot-map.component';
import { EcoMapAggMapComponent } from './agg-map/agg-map.component';

const COMPONENTS = [
  EcoMapComponent,
  EcoMapDotMapComponent,
  EcoMapAggMapComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    EcoMapRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class EcoMapModule { }
