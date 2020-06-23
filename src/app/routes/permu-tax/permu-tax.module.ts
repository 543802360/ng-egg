import { NgxEchartsModule } from 'ngx-echarts';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { PermuTaxRoutingModule } from './permu-tax-routing.module';
import { PermuTaxPermDatavComponent } from './perm-datav/perm-datav.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { NgMapboxModule } from '@core/ng-mapbox/ng-mapbox.module';
import { PermuTaxPermMapComponent } from './perm-map/perm-map.component';

const COMPONENTS = [
  PermuTaxPermDatavComponent,
  PermuTaxPermMapComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    NgxMapboxGLModule,
    NgMapboxModule,
    NgxEchartsModule,
    PermuTaxRoutingModule
  ],
  declarations:
    [
      ...COMPONENTS,
      ...COMPONENTS_NOROUNT
    ],
  entryComponents: COMPONENTS_NOROUNT
})
export class PermuTaxModule { }
