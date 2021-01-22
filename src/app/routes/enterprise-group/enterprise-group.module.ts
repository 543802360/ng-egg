import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { EnterpriseGroupRoutingModule } from './enterprise-group-routing.module';
import { EnterpriseGroupOrderComponent } from './order/order.component';
import { EnterpriseGroupDetailComponent } from './detail/detail.component';
import { EnterpriseGroupMapComponent } from './map/map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

const COMPONENTS = [
  EnterpriseGroupOrderComponent,
  EnterpriseGroupDetailComponent,
  EnterpriseGroupMapComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    NgxMapboxGLModule,
    EnterpriseGroupRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class EnterpriseGroupModule { }
