import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TaxDatavRoutingModule } from './tax-datav-routing.module';
import { TaxDatavNavComponent } from './nav/nav.component';
import { TaxDatavSummaryComponent } from './summary/summary.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NgxEchartsModule } from 'ngx-echarts';
import { TaxDatavGsqyComponent } from './gsqy/gsqy.component';
import { TaxDatavBwqyphbComponent } from './bwqyphb/bwqyphb.component';
import { TaxDatavMjsh0Component } from './mjsh0/mjsh0.component';
import { TaxDatavJtqyComponent } from './jtqy/jtqy.component';
import { NgLeafletModule } from "../../ng-leaflet/ng-leaflet.module";
import { TaxDatavZtDjsComponent } from './zt_djs/zt_djs.component';
import { TaxDatavZtSyjgComponent } from './zt_syjg/zt_syjg.component';
import { TaxDatavZtGxjsComponent } from './zt_gxjs/zt_gxjs.component';
import { TaxDatavZtFdcComponent } from './zt_fdc/zt_fdc.component';
import { TaxDatavZtGsqyGyComponent } from './zt_gsqy_gy/zt_gsqy_gy.component';


const COMPONENTS = [
  TaxDatavNavComponent,
  TaxDatavSummaryComponent,
  TaxDatavGsqyComponent,
  TaxDatavBwqyphbComponent,
  TaxDatavMjsh0Component,
  TaxDatavJtqyComponent,
  TaxDatavZtDjsComponent,
  TaxDatavZtSyjgComponent,
  TaxDatavZtGxjsComponent,
  TaxDatavZtFdcComponent,
  TaxDatavZtGsqyGyComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    NgxMapboxGLModule,
    NgxEchartsModule,
    SharedModule,
    TaxDatavRoutingModule,
    NgLeafletModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class TaxDatavModule { }
