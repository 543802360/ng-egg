import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ThematicAnalysisRoutingModule } from './thematic-analysis-routing.module';
import { DjsEnterpriseGroupOrderComponent } from './djs/djs.component';
import { FdcEnterpriseGroupOrderComponent } from './fdc/fdc.component';
import { GsqyfwEnterpriseGroupOrderComponent } from './gsqy-fw/gsqy-fw.component';
import { GsqygyEnterpriseGroupOrderComponent } from './gsqy-gy/gsqy-gy.component';
import { GxjsEnterpriseGroupOrderComponent } from './gxjs/gxjs.component';
import { JzqyEnterpriseGroupOrderComponent } from './jzqy/jzqy.component';
import { KjxzxEnterpriseGroupOrderComponent } from './kjxzx/kjxzx.component';
import { XsqyplsyEnterpriseGroupOrderComponent } from './xsqy-plsy/xsqy-plsy.component';
import { EnterpriseGroupDetailComponent } from './detail/detail.component';
import { EnterpriseGroupMapComponent } from './map/map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { NzTabsModule } from "ng-zorro-antd/tabs"

const COMPONENTS = [
  DjsEnterpriseGroupOrderComponent,
  FdcEnterpriseGroupOrderComponent,
  GsqyfwEnterpriseGroupOrderComponent,
  GsqygyEnterpriseGroupOrderComponent,
  GxjsEnterpriseGroupOrderComponent,
  JzqyEnterpriseGroupOrderComponent,
  KjxzxEnterpriseGroupOrderComponent,
  XsqyplsyEnterpriseGroupOrderComponent,
  EnterpriseGroupDetailComponent,
  EnterpriseGroupMapComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    NzTabsModule,
    NgxMapboxGLModule,
    ThematicAnalysisRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class ThematicAnalysisModule { }
