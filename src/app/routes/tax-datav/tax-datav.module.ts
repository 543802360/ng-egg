import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TaxDatavRoutingModule } from './tax-datav-routing.module';
import { TaxDatavNavComponent } from './nav/nav.component';
import { TaxDatavSummaryComponent } from './summary/summary.component';

const COMPONENTS = [
  TaxDatavNavComponent,
  TaxDatavSummaryComponent];
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
