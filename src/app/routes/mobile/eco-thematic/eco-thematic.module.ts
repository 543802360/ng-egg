import { MobileTmOrderComponent } from './tm-order/tm-order.component';
import { MobileTmJdxzComponent } from './tm-jdxz/tm-jdxz.component';
import { MobileTmBigEnterpriseComponent } from './tm-big-enterprise/tm-big-enterprise.component';
import { MobileTmNavComponent } from './tm-nav/tm-nav.component';

import { SharedModule } from '@shared';
import { NgModule } from '@angular/core';
import { EcoThematicRoutingModule } from './eco-thematic-routing.module';

const COMPONENTS = [
  MobileTmBigEnterpriseComponent,
  MobileTmJdxzComponent,
  MobileTmOrderComponent,
  MobileTmNavComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    EcoThematicRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class EcoThematicModule { }
