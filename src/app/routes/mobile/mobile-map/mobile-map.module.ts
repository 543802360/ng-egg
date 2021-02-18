import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { MobileMapRoutingModule } from './mobile-map-routing.module';
import { MobileMapJdxzMapComponent } from './jdxz-map/jdxz-map.component';
import { MobileMapDotMapComponent } from './dot-map/dot-map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';

const COMPONENTS: Type<void>[] = [
  MobileMapJdxzMapComponent,
  MobileMapDotMapComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    MobileMapRoutingModule,
    NgZorroAntdMobileModule,
    NgxMapboxGLModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class MobileMapModule { }
