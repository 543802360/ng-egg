import { MobileTmOrderComponent } from './tm-order/tm-order.component';
import { MobileTmJdxzComponent } from './tm-jdxz/tm-jdxz.component';
import { MobileTmBigEnterpriseComponent } from './tm-big-enterprise/tm-big-enterprise.component';
import { MobileTmNavComponent } from './tm-nav/tm-nav.component';

import { SharedModule } from '@shared';
import { NgModule } from '@angular/core';
import { EcoThematicRoutingModule } from './eco-thematic-routing.module';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { MobileSharedModule } from '../mobile-shared/mobile-shared.module';
import { MobileTmSingleComponent } from './tm-single/tm-single.component';

const COMPONENTS = [
  MobileTmBigEnterpriseComponent,
  MobileTmJdxzComponent,
  MobileTmOrderComponent,
  MobileTmNavComponent,
  MobileTmSingleComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    MobileSharedModule,
    NgZorroAntdMobileModule,
    EcoThematicRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class EcoThematicModule { }
