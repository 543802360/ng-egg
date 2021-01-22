import { NgxEchartsModule } from 'ngx-echarts';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { PermuTaxRoutingModule } from './permu-tax-routing.module';
import { PermuTaxPermDatavComponent } from './perm-datav/perm-datav.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { PermuTaxPermHyComponent } from './perm-hy/perm-hy.component';
import { PermuTaxPermOrderComponent } from './perm-order/perm-order.component';
import { PermuTaxPermMapComponent } from './perm-map/perm-map.component';
import { PermuTaxPermRiskComponent } from './perm-risk/perm-risk.component';


const COMPONENTS = [
  PermuTaxPermDatavComponent,
  PermuTaxPermHyComponent,
  PermuTaxPermOrderComponent,
  PermuTaxPermMapComponent,
  PermuTaxPermRiskComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    NgxMapboxGLModule,
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
