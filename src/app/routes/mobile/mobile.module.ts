// import { NgAntvF2Module } from 'ng-antv-f2';
import { SharedModule } from '@shared';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { MobileRoutingModule } from './mobile-routing.module';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
// import {} from "@ant-de"
const COMPONENTS = [HomeComponent];
const COMPONENTS_NOROUNT = [];


// const antDesignIcons = AllIcons as {
//   [key: string]: IconDefinition;
// };
// const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])


@NgModule({
  imports: [
    SharedModule,
    NgZorroAntdMobileModule,
    // NgAntvF2Module,
    MobileRoutingModule

  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class MobileModule { }
