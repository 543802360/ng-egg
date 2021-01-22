import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AvgTaxRoutingModule } from './avg-tax-routing.module';
import { AvgTaxMapComponent } from './map/map.component';
import { AvgTaxOrderComponent } from './order/order.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NgLeafletModule } from "../../ng-leaflet/ng-leaflet.module";

const COMPONENTS = [
  AvgTaxMapComponent,
  AvgTaxOrderComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    NgLeafletModule,
    NgxMapboxGLModule,
    AvgTaxRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class AvgTaxModule { }
