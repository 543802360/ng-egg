import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TaxDatavRoutingModule } from './tax-datav-routing.module';
import { TaxDatavNavComponent } from './nav/nav.component';
import { TaxDatavSummaryComponent } from './summary/summary.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NgxEchartsModule } from 'ngx-echarts';
import { TaxDatavGsqyComponent } from './gsqy/gsqy.component';

const COMPONENTS = [
  TaxDatavNavComponent,
  TaxDatavSummaryComponent,
  TaxDatavGsqyComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    NgxMapboxGLModule,
    NgxEchartsModule,
    SharedModule,
    TaxDatavRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class TaxDatavModule { }
