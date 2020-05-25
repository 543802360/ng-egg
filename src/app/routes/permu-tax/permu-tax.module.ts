import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { PermuTaxRoutingModule } from './permu-tax-routing.module';
import { PermuTaxDatavmapComponent } from './datavmap/datavmap.component';

const COMPONENTS = [

  PermuTaxDatavmapComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PermuTaxRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class PermuTaxModule { }
