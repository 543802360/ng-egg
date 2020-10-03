import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TaxDatavRoutingModule } from './tax-datav-routing.module';
import { TaxDatavNavComponent } from './nav/nav.component';

const COMPONENTS = [
  TaxDatavNavComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    TaxDatavRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class TaxDatavModule { }
